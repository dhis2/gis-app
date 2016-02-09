Ext.onReady(function() {

    var init = {
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
            callbacks = 0,
            ajax,
            fn;

        init.contextPath = config.url;

        fn = function() {
            if (++callbacks === requests.length) {
                isInitComplete = true;

                for (var i = 0; i < configs.length; i++) {
                    execute(configs[i]);
                }
            }
        };

        ajax = function(requestConfig, authConfig) {
            authConfig = authConfig || config;

            if (authConfig.crossDomain && Ext.isString(authConfig.username) && Ext.isString(authConfig.password)) {
                requestConfig.headers = Ext.isObject(authConfig.headers) ? authConfig.headers : {};
                requestConfig.headers['Authorization'] = 'Basic ' + btoa(authConfig.username + ':' + authConfig.password);
            }

            Ext.Ajax.request(requestConfig);
        };

        // dhis2
        requests.push({
            url: init.contextPath + '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat',
            disableCaching: false,
            success: function(r) {
                var systemSettings = r.responseText ? Ext.decode(r.responseText) : r,
                    userAccountConfig;

                init.systemInfo.dateFormat = Ext.isString(systemSettings.keyDateFormat) ? systemSettings.keyDateFormat.toLowerCase() : 'yyyy-mm-dd';
                init.systemInfo.calendar = systemSettings.keyCalendar;

                // user-account
                userAccountConfig = {
                    url: init.contextPath + '/api/me/user-account.json',
                    disableCaching: false,
                    success: function(r) {
                        init.userAccount = r.responseText ? Ext.decode(r.responseText) : r;

                        var onScriptReady = function() {
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
                                url: contextPath + '/api/optionSets.json?fields=id,version&paging=false',
                                disableCaching: false,
                                success: function(r) {
                                    var optionSets = (r.responseText ? Ext.decode(r.responseText).optionSets : r.optionSets) || [],
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
                                        url: contextPath + '/api/optionSets.json?fields=id,name,version,options[code,name]&paging=false' + url,
                                        disableCaching: false,
                                        success: function(r) {
                                            var sets = r.responseText ? Ext.decode(r.responseText).optionSets : r.optionSets;

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

                                            ajax(optionSetConfig);
                                        }
                                    };

                                    registerOptionSet = function(optionSet) {
                                        store.get('optionSets', optionSet.id).done(function(obj) {
                                            if (!Ext.isObject(obj) || obj.version !== optionSet.version) {
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
                                }
                            };

                            // option sets
                            ajax(optionSetVersionConfig);
                        };

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
                    }
                };

                ajax(userAccountConfig);
            }
        });

        // user orgunit
        requests.push({
            url: init.contextPath + '/api/organisationUnits.json?userOnly=true&fields=id,' + init.namePropertyUrl + ',children[id,' + init.namePropertyUrl + ']&paging=false',
            disableCaching: false,
            success: function(r) {
                var organisationUnits = (r.responseText ? Ext.decode(r.responseText).organisationUnits : r) || [],
                    ou = [],
                    ouc = [];

                if (organisationUnits.length) {
                    for (var i = 0, org; i < organisationUnits.length; i++) {
                        org = organisationUnits[i];

                        ou.push(org.id);

                        if (org.children) {
                            ouc = Ext.Array.clean(ouc.concat(Ext.Array.pluck(org.children, 'id') || []));
                        }
                    }

                    init.user = init.user || {};
                    init.user.ou = ou;
                    init.user.ouc = ouc;
                } else {
                    gis.alert('User is not assigned to any organisation units');
                }

                fn();
            }
        });

        // dimensions
        requests.push({
            url: init.contextPath + '/api/dimensions.json?fields=id,displayName|rename(name)&paging=false',
            disableCaching: false,
            success: function(r) {
                init.dimensions = r.responseText ? Ext.decode(r.responseText).dimensions : r.dimensions;
                fn();
            }
        });

        for (var i = 0; i < requests.length; i++) {
            ajax(requests[i]);
        }
    };

    execute = function(config) {
        var validateConfig,
            extendInstance,
            createViewport,
            afterRender,
            initialize,
            gis;

        validateConfig = function() {
            if (!Ext.isString(config.url)) {
                alert('Invalid url (' + config.el + ')');
                return;
            }

            if (config.url.split('').pop() === '/') {
                config.url = config.url.substr(0, config.url.length - 1);
            }

            if (!Ext.isString(config.el)) {
                alert('Invalid html element id (' + config.el + ')');
                return;
            }

            config.id = config.id || config.uid;

            if (config.id && !Ext.isString(config.id)) {
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
            gis.ajax = util.connection.ajax;

            // store
            store.groupsByGroupSet = Ext.create('Ext.data.Store', {
                fields: ['id', 'name', 'symbol'],
            });
        };

        createViewport = function(appConfig) {
            var viewport,
                items = [],
                northRegion,
                centerRegion,
                eastRegion,
                el = Ext.get(gis.el),
                eastWidth = gis.map.hideLegend ? 0 : (appConfig.plugin ? 120 : 200),
                trash = [];

            // north
            if (appConfig.dashboard) {
                items.push(northRegion = Ext.create('Ext.panel.Panel', {
                    region: 'north',
                    width: el.getWidth(),
                    height: 19,
                    bodyStyle: 'background-color: #fff; border: 0 none; font: bold 12px LiberationSans, arial, sans-serif; color: #333; text-align: center; line-height: 14px; letter-spacing: -0.1px',
                    html: ''
                }));
            }

            // center
            //items.push(centerRegion = new GeoExt.MapPanel({
            items.push(centerRegion = Ext.create('Ext.panel.Panel', {
                region: 'center',
                //map: gis.olmap,
                bodyStyle: 'border: 1px solid #d0d0d0',
                width: el.getWidth() - eastWidth
            }));

            // east
            if (appConfig.dashboard) {
                items.push(eastRegion = Ext.create('Ext.panel.Panel', {
                    width: 0,
                    height: 0
                }));
            }
            else {
                items.push(eastRegion = Ext.create('Ext.panel.Panel', {
                    region: 'east',
                    layout: 'anchor',
                    bodyStyle: 'border-top:0 none; border-bottom:0 none',
                    width: eastWidth,
                    preventHeader: true,
                    defaults: {
                        bodyStyle: 'padding: 6px; border: 0 none',
                        collapsible: true,
                        collapsed: true,
                        animCollapse: false
                    },
                    items: [
                        {
                            title: GIS.i18n.thematic_layer_1_legend,
                            cls: 'gis-panel-legend',
                            bodyStyle: 'padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;',
                            listeners: {
                                added: function() {
                                    gis.layer.thematic1.legendPanel = this;
                                }
                            }
                        },
                        {
                            title: GIS.i18n.thematic_layer_2_legend,
                            cls: 'gis-panel-legend',
                            bodyStyle: 'padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;',
                            listeners: {
                                added: function() {
                                    gis.layer.thematic2.legendPanel = this;
                                }
                            }
                        },
                        {
                            title: GIS.i18n.thematic_layer_3_legend,
                            cls: 'gis-panel-legend',
                            bodyStyle: 'padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;',
                            listeners: {
                                added: function() {
                                    gis.layer.thematic3.legendPanel = this;
                                }
                            }
                        },
                        {
                            title: GIS.i18n.thematic_layer_4_legend,
                            cls: 'gis-panel-legend',
                            bodyStyle: 'padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;',
                            listeners: {
                                added: function() {
                                    gis.layer.thematic4.legendPanel = this;
                                }
                            }
                        },
                        {
                            title: GIS.i18n.facility_layer_legend,
                            cls: 'gis-panel-legend',
                            bodyStyle: 'padding:3px 0 4px 5px; border-width:1px 0 1px 0; border-color:#d0d0d0;',
                            listeners: {
                                added: function() {
                                    gis.layer.facility.legendPanel = this;
                                }
                            }
                        }
                    ]
                }));
            }

            viewport = Ext.create('Ext.panel.Panel', {
                renderTo: el,
                width: el.getWidth(),
                height: el.getHeight(),
                cls: 'gis-plugin',
                layout: 'border',
                bodyStyle: 'border: 0 none',
                items: items,
                listeners: {
                    afterrender: function() {
                        afterRender();
                    }
                }
            });

            viewport.northRegion = northRegion;
            viewport.centerRegion = centerRegion;
            viewport.eastRegion = eastRegion;

            viewport.centerRegion.trash = trash;
            viewport.centerRegion.getEl().on('mouseleave', function() {
                for (var i = 0, cmp; i < trash.length; i++) {
                    cmp = viewport.centerRegion.trash[i];

                    if (cmp && cmp.destroy) {
                        cmp.destroy();
                    }
                }
            });

            return viewport;
        };

        afterRender = function(vp) {

            // map buttons
            //var clsArray = ['zoomIn-verticalButton', 'zoomOut-verticalButton', 'zoomVisible-verticalButton', 'measure-verticalButton', 'legend-verticalButton'],
            var clsArray = [
                    'zoomInButton',
                    'zoomIn-verticalButton',
                    'zoomOutButton',
                    'zoomOut-verticalButton',
                    'zoomVisibleButton',
                    'zoomVisible-verticalButton',
                    'measureButton',
                    'measure-verticalButton',
                    'legendButton',
                    'legend-verticalButton'
                ],
                map = {
                    'zoomIn-verticalButton': 'zoomin_24.png',
                    'zoomOut-verticalButton': 'zoomout_24.png',
                    'zoomVisible-verticalButton': 'zoomvisible_24.png',
                    'measure-verticalButton': 'measure_24.png',
                    'legend-verticalButton': 'legend_24.png',
                    'zoomInButton': 'zoomin_24.png',
                    'zoomOutButton': 'zoomout_24.png',
                    'zoomVisibleButton': 'zoomvisible_24.png',
                    'measureButton': 'measure_24.png',
                    'legendButton': 'legend_24.png'
                };

            for (var i = 0, cls, elArray; i < clsArray.length; i++) {
                cls = clsArray[i];
                elArray = Ext.query('.' + cls);

                for (var j = 0, el; j < elArray.length; j++) {
                    el = elArray[j];

                    if (el) {
                        el.innerHTML = '<img src="' + init.contextPath + '/dhis-web-commons/javascripts/plugin/images/' + map[cls] + '" />';
                    }
                }
            }

            // base layer
            if (Ext.isDefined(gis.map.baseLayer)) {
                var base = Ext.isString(gis.map.baseLayer) ? gis.map.baseLayer.split(' ').join('').toLowerCase() : gis.map.baseLayer;

                /*
                if (!base || base === 'none' || base === 'off') {
                    gis.layer.openStreetMap.setVisibility(false);
                }
                else if (base === 'gh' || base === 'googlehybrid') {
                    gis.olmap.setBaseLayer(gis.layer.googleHybrid);
                }
                else if (base === 'osm' || base === 'openstreetmap') {
                    gis.olmap.setBaseLayer(gis.layer.openStreetMap);
                }
                */
            }
        };

        initialize = function() {
            var el = Ext.get(config.el),
                appConfig;

            if (!validateConfig()) {
                return;
            }

            appConfig = {
                plugin: true,
                dashboard: Ext.isBoolean(config.dashboard) ? config.dashboard : false,
                crossDomain: Ext.isBoolean(config.crossDomain) ? config.crossDomain : true,
                skipMask: Ext.isBoolean(config.skipMask) ? config.skipMask : false,
                skipFade: Ext.isBoolean(config.skipFade) ? config.skipFade : false,
                el: Ext.isString(config.el) ? config.el : null,
                username: Ext.isString(config.username) ? config.username : null,
                password: Ext.isString(config.password) ? config.password : null
            };

            // css
            //applyCss();


            console.log(init, appConfig);

            // core
            gis = GIS.core.getInstance(init, appConfig);
            extendInstance(gis, appConfig);

            // google maps
            /*
            var gm_fn = function() {
                var googleStreets = new OpenLayers.Layer.Google('Google Streets', {
                    numZoomLevels: 20,
                    animationEnabled: true,
                    layerType: gis.conf.finals.layer.type_base,
                    layerOpacity: 1,
                    setLayerOpacity: function(number) {
                        if (number) {
                            this.layerOpacity = parseFloat(number);
                        }
                        this.setOpacity(this.layerOpacity);
                    }
                });
                googleStreets.id = 'googleStreets';

                var googleHybrid = new OpenLayers.Layer.Google('Google Hybrid', {
                    type: google.maps.MapTypeId.HYBRID,
                    numZoomLevels: 20,
                    animationEnabled: true,
                    layerType: gis.conf.finals.layer.type_base,
                    layerOpacity: 1,
                    setLayerOpacity: function(number) {
                        if (number) {
                            this.layerOpacity = parseFloat(number);
                        }
                        this.setOpacity(this.layerOpacity);
                    }
                });
                googleHybrid.id = 'googleHybrid';

                gis.olmap.addLayers([googleStreets, googleHybrid]);

                if (config.baseLayer === 'osm') {
                    gis.olmap.setBaseLayer(gis.layer.openStreetMap);
                }
                else if (config.baseLayer === 'gh') {
                    gis.olmap.setBaseLayer(googleHybrid);
                }
                else {
                    gis.olmap.setBaseLayer(googleStreets);
                }
            };
            */

            /*
            if (GIS_GM.ready) {
                console.log("(Item " + config.el + ") GM is ready -> skip queue, add layers, set as baselayer");
                gm_fn();
            }
            else {
                if (GIS_GM.offline) {
                    console.log("Deactivate base layer");
                    gis.olmap.baseLayer.setVisibility(false);
                }
                else {
                    console.log("GM is not ready -> add to queue");
                    GIS_GM.array.push({
                        scope: this,
                        fn: gm_fn
                    });
                }
            }
            */

            /*
            GIS.core.createSelectHandlers(gis, gis.layer.boundary);
            GIS.core.createSelectHandlers(gis, gis.layer.thematic1);
            GIS.core.createSelectHandlers(gis, gis.layer.thematic2);
            GIS.core.createSelectHandlers(gis, gis.layer.thematic3);
            GIS.core.createSelectHandlers(gis, gis.layer.thematic4);
            GIS.core.createSelectHandlers(gis, gis.layer.facility);
            */

            gis.map = config;
            gis.viewport = createViewport(appConfig);

            // dashboard element
            if (el) {
                el.setViewportWidth = function(width) {
                    gis.viewport.setWidth(width);
                    gis.viewport.centerRegion.setWidth(width);

                    if (gis.viewport.northRegion) {
                        gis.viewport.northRegion.setWidth(width);
                    }
                };
            }

            gis.mask = Ext.create('Ext.LoadMask', gis.viewport.centerRegion.getEl(), {
                msg: 'Loading'
            });

            GIS.core.MapLoader(gis, config).load();
        }();
    };

    GIS.plugin.getMap = function(config) {
        if (Ext.isString(config.url) && config.url.split('').pop() === '/') {
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

    DHIS = Ext.isObject(window['DHIS']) ? DHIS : {};
    DHIS.getMap = GIS.plugin.getMap;

});