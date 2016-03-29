import core from './core/index.js';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';
import '../scss/plugin.scss';

Ext.onReady(function() {

    var gis,
        init = {
            user: {},
            systemInfo: {}
        },
        configs = [],
        isInitStarted = false,
        isInitComplete = false,
        isInitGM = false,
        getInit,
        execute;

    GIS.i18n = {
        event_layer: 'Event layer',
        boundary_layer: 'Boundary layer',
        facility_layer: 'Facility layer',
        thematic_layer: 'Thematic layer',
        measure_distance: 'Measure distance',
        coordinates_could_not_be_loaded: 'Coordinates could not be loaded',
        invalid_coordinates: 'Invalid coordinates',
        no_valid_coordinates_found: 'No valid coordinates found'
    };

    GIS.plugin = {};

    getInit = function(config) {
        var isInit = false,
            requests = [],
            onSystemSettingsLoad,
            onOrgUnitsLoad,
            onDimensionsLoad,
            onUserAccountLoad,
            onOptionSetsLoad,
            onScriptReady,
            callbacks = 0,
            fn;

        init.contextPath = config.url;
        init.defaultHeaders = {};

        if (config.username && config.password) {

            Ext.Ajax.defaultHeaders = {
                'Authorization': 'Basic ' + btoa(config.username + ':' + config.password)
            };

            init.defaultHeaders['Authorization'] = 'Basic ' + btoa(config.username + ':' + config.password);
        }

        fn = function() {
            if (++callbacks === requests.length) {
                isInitComplete = true;

                for (var i = 0; i < configs.length; i++) {
                    execute(configs[i]);
                }
            }
        };

        onSystemSettingsLoad = function (r) {
            var systemSettings = r.responseText ? JSON.parse(r.responseText) : r,
                userAccountConfig;

            init.systemInfo.dateFormat = isString(systemSettings.keyDateFormat) ? systemSettings.keyDateFormat.toLowerCase() : 'yyyy-mm-dd';
            init.systemInfo.calendar = systemSettings.keyCalendar;

            // user-account
            userAccountConfig = {
                url: init.contextPath + '/api/me/user-account.json',
                disableCaching: false,
                success: onUserAccountLoad
            };

            Ext.Ajax.request(userAccountConfig);
        };

        onOrgUnitsLoad = function (r) {
            var organisationUnits = (r.responseText ? JSON.parse(r.responseText).organisationUnits : r) || [],
                ou = [],
                ouc = [];

            if (organisationUnits.length) {
                for (var i = 0, org; i < organisationUnits.length; i++) {
                    org = organisationUnits[i];

                    ou.push(org.id);

                    if (org.children) {
                        ouc = arrayClean(ouc.concat(arrayPluck(org.children, 'id') || []));
                    }
                }

                init.user = init.user || {};
                init.user.ou = ou;
                init.user.ouc = ouc;
            } else {
                gis.alert('User is not assigned to any organisation units');
            }

            fn();
        };

        onDimensionsLoad = function (r) {
            init.dimensions = r.responseText ? JSON.parse(r.responseText).dimensions : r.dimensions;
            fn();
        };

        onUserAccountLoad = function (r) {
            init.userAccount = r.responseText ? JSON.parse(r.responseText) : r;

            // init
            if (window['dhis2'] && window['jQuery']) {
                onScriptReady();
            }
            else {
                Ext.Loader.injectScriptElement(init.contextPath + '/dhis-web-commons/javascripts/jQuery/jquery.min.js', function() {
                    Ext.Loader.injectScriptElement(init.contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.util.js', function() {
                        Ext.Loader.injectScriptElement(init.contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.storage.js', function() {
                            Ext.Loader.injectScriptElement(init.contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.storage.idb.js', function() {
                                Ext.Loader.injectScriptElement(init.contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.storage.ss.js', function() {
                                    Ext.Loader.injectScriptElement(init.contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.storage.memory.js', function() {
                                        onScriptReady();
                                    });
                                });
                            });
                        });
                    });
                });
            }
        };

        onOptionSetsLoad = function (r) {
            var optionSets = (r.responseText ? JSON.parse(r.responseText).optionSets : r.optionSets) || [],
                store = dhis2.gis.store,
                ids = [],
                url = '',
                callbacks = 0,
                registerOptionSet,
                updateStore,
                optionSetConfig;

            if (!optionSets.length) {
                fn();
                return;
            }

            optionSetConfig = {
                url: encodeURI(init.contextPath + '/api/optionSets.json?fields=id,name,version,options[code,name]&paging=false' + url),
                disableCaching: false,
                success: function(r) {
                    var sets = r.responseText ? JSON.parse(r.responseText).optionSets : r.optionSets;

                    store.setAll('optionSets', sets).done(fn);
                }
            };

            updateStore = function() {
                if (++callbacks === optionSets.length) {
                    if (!ids.length) {
                        fn();
                        return;
                    }

                    for (var i = 0; i < ids.length; i++) {
                        url += '&filter=id:eq:' + ids[i];
                    }

                    Ext.Ajax.request(optionSetConfig);
                }
            };

            registerOptionSet = function(optionSet) {
                store.get('optionSets', optionSet.id).done(function(obj) {
                    if (!isObject(obj) || obj.version !== optionSet.version) {
                        ids.push(optionSet.id);
                    }

                    updateStore();
                });
            };

            store.open().done(function() {
                for (var i = 0; i < optionSets.length; i++) {
                    registerOptionSet(optionSets[i]);
                }
            });
        };

        onScriptReady = function () {
            var defaultKeyUiLocale = 'en',
                defaultKeyAnalysisDisplayProperty = 'displayName',
                displayPropertyMap = {
                    'name': 'displayName',
                    'displayName': 'displayName',
                    'shortName': 'displayShortName',
                    'displayShortName': 'displayShortName'
                },
                namePropertyUrl,
                contextPath,
                keyUiLocale,
                keyAnalysisDisplayProperty,
                dateFormat,
                optionSetVersionConfig;

            init.userAccount.settings.keyUiLocale = init.userAccount.settings.keyUiLocale || defaultKeyUiLocale;
            init.userAccount.settings.keyAnalysisDisplayProperty = displayPropertyMap[init.userAccount.settings.keyAnalysisDisplayProperty] || defaultKeyAnalysisDisplayProperty;

            // local vars
            contextPath = init.contextPath;
            keyUiLocale = init.userAccount.settings.keyUiLocale;
            keyAnalysisDisplayProperty = init.userAccount.settings.keyAnalysisDisplayProperty;
            namePropertyUrl = keyAnalysisDisplayProperty + '|rename(name)';
            dateFormat = init.systemInfo.dateFormat;

            init.namePropertyUrl = namePropertyUrl;

            // dhis2
            dhis2.util.namespace('dhis2.gis');

            dhis2.gis.store = dhis2.gis.store || new dhis2.storage.Store({
                    name: 'dhis2',
                    adapters: [dhis2.storage.IndexedDBAdapter, dhis2.storage.DomSessionStorageAdapter, dhis2.storage.InMemoryAdapter],
                    objectStores: ['optionSets']
                });

            optionSetVersionConfig = {
                url: encodeURI(contextPath + '/api/optionSets.json?fields=id,version&paging=false'),
                disableCaching: false,
                success: onOptionSetsLoad
            };

            // option sets
            Ext.Ajax.request(optionSetVersionConfig);
        };

        // dhis2
        requests.push({
            url: encodeURI(init.contextPath + '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat'),
            disableCaching: false,
            success: onSystemSettingsLoad
        });

        // user orgunit
        requests.push({
            url: encodeURI(init.contextPath + '/api/organisationUnits.json?userOnly=true&fields=id,' + init.namePropertyUrl + ',children[id,' + init.namePropertyUrl + ']&paging=false'),
            disableCaching: false,
            success: onOrgUnitsLoad
        });

        // dimensions
        requests.push({
            url: encodeURI(init.contextPath + '/api/dimensions.json?fields=id,displayName|rename(name)&paging=false'),
            disableCaching: false,
            success: onDimensionsLoad
        });

        for (var i = 0; i < requests.length; i++) {
            Ext.Ajax.request(requests[i]);
        }
    };

    execute = function(config) {
        var validateConfig,
            extendInstance,
            initLayout,
            afterRender,
            initialize,
            gis;

        validateConfig = function() {
            if (!isString(config.url)) {
                alert('Invalid url (' + config.el + ')');
                return;
            }

            if (config.url.split('').pop() === '/') {
                config.url = config.url.substr(0, config.url.length - 1);
            }

            if (!isString(config.el)) {
                alert('Invalid html element id (' + config.el + ')');
                return;
            }

            config.id = config.id || config.uid;

            if (config.id && !isString(config.id)) {
                alert('Invalid map id (' + config.el + ')');
                return;
            }

            return true;
        };

        extendInstance = function(gis, appConfig) {
            var init = gis.init,
                api = gis.api,
                conf = gis.conf,
                store = gis.store,
                util = gis.util,
                type = 'json',
                headerMap = {
                    json: 'application/json'
                },
                headers = {
                    'Content-Type': headerMap[type],
                    'Accepts': headerMap[type]
                };

            init.el = config.el;

            gis.plugin = appConfig.plugin;
            gis.dashboard = appConfig.dashboard;
            gis.crossDomain = appConfig.crossDomain;
            gis.skipMask = appConfig.skipMask;
            gis.skipFade = appConfig.skipFade;
            gis.el = appConfig.el;
            gis.username = appConfig.username;
            gis.password = appConfig.password;

            // store
            store.groupsByGroupSet = Ext.create('Ext.data.Store', {
                fields: ['id', 'name', 'symbol'],
            });
        };

        initLayout = function(appConfig) {
            var container = document.getElementById(appConfig.el),
                titleEl = document.createElement('div'),
                map = gis.instance;

            container.className = 'dhis2-map-widget-container';
            titleEl.className = 'dhis2-map-title';

            container.appendChild(titleEl);
            container.appendChild(map.getContainer());

            container.titleEl = titleEl;

            map.addControl({
                type: 'zoom',
                position: 'topright'
            });

            map.invalidateSize();
            map.fitBounds([[-34.9, -18.7], [35.9, 50.2]]);

            // base layer
            gis.map.baseLayer = gis.map.baseLayer || 'none';

            var base = isString(gis.map.baseLayer) ? gis.map.baseLayer.split(' ').join('').toLowerCase() : gis.map.baseLayer;

            if (!base || base === 'none' || base === 'off') {
                map.addLayer(gis.layer.openStreetMap.config);
            }
            else if (base === 'gs' || base === 'googlestreets') {
                map.addLayer(gis.layer.googleStreets.config);
            }
            else if (base === 'gh' || base === 'googlehybrid') {
                map.addLayer(gis.layer.googleHybrid.config);
            }

            return container;
        },

        initialize = function() {
            var appConfig;

            if (!validateConfig()) {
                return;
            }

            appConfig = {
                plugin: true,
                dashboard: isBoolean(config.dashboard) ? config.dashboard : false,
                crossDomain: isBoolean(config.crossDomain) ? config.crossDomain : true,
                skipMask: isBoolean(config.skipMask) ? config.skipMask : false,
                skipFade: isBoolean(config.skipFade) ? config.skipFade : false,
                el: isString(config.el) ? config.el : null,
                username: isString(config.username) ? config.username : null,
                password: isString(config.password) ? config.password : null
            };

            // core
            gis = GIS.core.getInstance(init, appConfig);
            extendInstance(gis, appConfig);

            gis.map = config;
            gis.container = initLayout(appConfig);

            /* TODO
            gis.mask = Ext.create('Ext.LoadMask', gis.viewport.centerRegion.getEl(), {
                msg: 'Loading'
            });
            */

            gis.instance.scrollWheelZoom.disable();

            GIS.core.MapLoader(gis, config).load();

        }();
    };

    GIS.plugin.getMap = function(config) {
        if (isString(config.url) && config.url.split('').pop() === '/') {
            config.url = config.url.substr(0, config.url.length - 1);
        }

        if (isInitComplete) {
            execute(config);
        }
        else {
            configs.push(config);

            if (!isInitStarted) {
                isInitStarted = true;

                getInit(config);
            }
        }
    };

    var DHIS = isObject(window['DHIS']) ? window.DHIS : {};
    DHIS.getMap = GIS.plugin.getMap;

});