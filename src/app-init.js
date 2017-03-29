// Code copied from the old app.js --> Should be refactored

import isString from 'd2-utilizr/lib/isString';
import isObject from 'd2-utilizr/lib/isObject';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';

let gis;

Ext.onReady( function() {

    // set app config
    (function() {

        // ext configuration
        Ext.QuickTips.init();

        Ext.override(Ext.grid.Scroller, {
            afterRender() {
                var me = this;
                me.self.superclass.onHide.call(me);
                me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
                Ext.cache[me.el.id].skipGarbageCollection = true;
                // add another scroll event listener to check, if main listeners is active
                Ext.EventManager.addListener(me.scrollEl, 'scroll', me.onElScrollCheck, me);
                // ensure this listener doesn't get removed
                Ext.cache[me.scrollEl.id].skipGarbageCollection = true;
            },

            // flag to check, if main listeners is active
            wasScrolled: false,

            // synchronize the scroller with the bound gridviews
            onElScroll(event, target) {
                this.wasScrolled = true; // change flag -> show that listener is alive
                this.fireEvent('bodyscroll', event, target);
            },

            // executes just after main scroll event listener and check flag state
            onElScrollCheck(event, target, options) {
                var me = this;

                if (!me.wasScrolled) {
                    // Achtung! Event listener was disappeared, so we'll add it again
                    me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
                }
                me.wasScrolled = false; // change flag to initial value
            }

        });
    }());

    // Initialize
    (function() {
        var requests = [],
            callbacks = 0,
            init = {
                user: {},
                systemSettings: {},
                extensions: {}
            },
            fn;

        fn = function() {
            if (++callbacks === requests.length) {

                // instance
                gis = GIS.core.getInstance(init);

                // ux
                GIS.app.createExtensions(gis);

                // extend instance
                GIS.app.extendInstance(gis);

                // viewport
                // gis.viewport = createViewport();

                window.gis = gis; // TODO

                // Remove loading mask
                const maskEl = document.getElementById('loading-mask');
                maskEl.parentNode.removeChild(maskEl);
            }
        };

        // dhis2
        dhis2.util.namespace('dhis2.gis');

        dhis2.gis.store = dhis2.gis.store || new dhis2.storage.Store({
                name: 'dhis2',
                adapters: [dhis2.storage.IndexedDBAdapter, dhis2.storage.DomSessionStorageAdapter, dhis2.storage.InMemoryAdapter],
                objectStores: ['optionSets']
            });

        // requests
        Ext.Ajax.request({
            url: encodeURI('manifest.webapp'),
            success(r) {
                var context = JSON.parse(r.responseText).activities.dhis;

                init.contextPath = context.href;

                init.apiPath = init.contextPath + '/api/' + GIS.apiVersion + '/';
                init.analyticsPath = init.contextPath + '/api/25/'; // TODO: Only use apiPath
                init.defaultHeaders = {};

                if (context.auth) {
                    Ext.Ajax.defaultHeaders = {
                        'Authorization': 'Basic ' + btoa(context.auth)
                    };

                    init.defaultHeaders['Authorization'] = 'Basic ' + btoa(context.auth); // Used by fetch
                }

                // system info
                Ext.Ajax.request({
                    url: encodeURI(init.apiPath + 'system/info.json'),
                    success(r) {
                        init.systemInfo = JSON.parse(r.responseText);
                        init.contextPath = init.systemInfo.contextPath || init.contextPath;

                        // date, calendar, mapzen search key
                        Ext.Ajax.request({
                            url: encodeURI(init.apiPath + 'systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyGoogleMapsApiKey&key=keyMapzenSearchApiKey'),
                            success(r) {
                                var systemSettings = JSON.parse(r.responseText);

                                init.systemInfo.dateFormat = isString(systemSettings.keyDateFormat) ? systemSettings.keyDateFormat.toLowerCase() : 'yyyy-mm-dd';
                                init.systemInfo.calendar = systemSettings.keyCalendar;
                                init.systemInfo.mapzenSearchKey = systemSettings.keyMapzenSearchApiKey;
                                init.systemInfo.googleMapsKey = systemSettings.keyGoogleMapsApiKey;

                                // user-account
                                Ext.Ajax.request({
                                    url: encodeURI(init.contextPath + '/api/me/user-account.json'),
                                    success(r) {
                                        init.userAccount = JSON.parse(r.responseText);

                                        // init
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
                                            dateFormat;

                                        init.userAccount.settings.keyUiLocale = init.userAccount.settings.keyUiLocale || defaultKeyUiLocale;
                                        init.userAccount.settings.keyAnalysisDisplayProperty = displayPropertyMap[init.userAccount.settings.keyAnalysisDisplayProperty] || defaultKeyAnalysisDisplayProperty;

                                        // local vars
                                        contextPath = init.contextPath;
                                        keyUiLocale = init.userAccount.settings.keyUiLocale;
                                        keyAnalysisDisplayProperty = init.userAccount.settings.keyAnalysisDisplayProperty;
                                        namePropertyUrl = keyAnalysisDisplayProperty + '~rename(name)';
                                        dateFormat = init.systemInfo.dateFormat;

                                        init.namePropertyUrl = namePropertyUrl;

                                        // calendar
                                        (function() {
                                            var dhis2PeriodUrl = 'dhis2/dhis2.period.js',
                                                defaultCalendarId = 'gregorian',
                                                calendarIdMap = {'iso8601': defaultCalendarId},
                                                calendarId = calendarIdMap[init.systemInfo.calendar] || init.systemInfo.calendar || defaultCalendarId,
                                                calendarIds = ['coptic', 'ethiopian', 'islamic', 'julian', 'nepali', 'thai'],
                                                calendarScriptUrl,
                                                createGenerator;

                                            // calendar
                                            createGenerator = function() {
                                                init.calendar = $.calendars.instance(calendarId);
                                                init.periodGenerator = new dhis2.period.PeriodGenerator(init.calendar, init.systemInfo.dateFormat);
                                            };

                                            if (arrayContains(calendarIds, calendarId)) {
                                                calendarScriptUrl = 'dhis2/jquery.calendars.' + calendarId + '.min.js';

                                                Ext.Loader.injectScriptElement(calendarScriptUrl, function() {
                                                    Ext.Loader.injectScriptElement(dhis2PeriodUrl, createGenerator);
                                                });
                                            }
                                            else {
                                                Ext.Loader.injectScriptElement(dhis2PeriodUrl, createGenerator);
                                            }
                                        }());

                                        // i18n
                                        requests.push({
                                            url: encodeURI('i18n/i18n_app.properties'),
                                            success(r) {
                                                GIS.i18n = dhis2.util.parseJavaProperties(r.responseText);

                                                if (keyUiLocale === defaultKeyUiLocale) {
                                                    fn();
                                                }
                                                else {
                                                    Ext.Ajax.request({
                                                        url: encodeURI('i18n/i18n_app_' + keyUiLocale + '.properties'),
                                                        success(r) {
                                                            Ext.apply(GIS.i18n, dhis2.util.parseJavaProperties(r.responseText));
                                                        },
                                                        failure() {
                                                            console.log('No translations found for system locale (' + keyUiLocale + ')');
                                                        },
                                                        callback() {
                                                            fn();
                                                        }
                                                    });
                                                }
                                            },
                                            failure() {
                                                Ext.Ajax.request({
                                                    url: encodeURI('i18n/i18n_app_' + keyUiLocale + '.properties'),
                                                    success(r) {
                                                        GIS.i18n = dhis2.util.parseJavaProperties(r.responseText);
                                                    },
                                                    failure() {
                                                        alert('No translations found for system locale (' + keyUiLocale + ') or default locale (' + defaultKeyUiLocale + ').');
                                                    },
                                                    callback: fn
                                                });
                                            }
                                        });

                                        // root nodes
                                        requests.push({
                                            url: encodeURI(contextPath + '/api/organisationUnits.json?userDataViewFallback=true&paging=false&fields=id,' + namePropertyUrl + ',children[id,' + namePropertyUrl + ']'),
                                            success(r) {
                                                init.rootNodes = JSON.parse(r.responseText).organisationUnits || [];
                                                fn();
                                            }
                                        });

                                        // organisation unit levels
                                        requests.push({
                                            url: encodeURI(contextPath + '/api/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false'),
                                            success(r) {
                                                init.organisationUnitLevels = JSON.parse(r.responseText).organisationUnitLevels || [];

                                                if (!init.organisationUnitLevels.length) {
                                                    alert(GIS.i18n.no_organisation_unit_levels);
                                                }

                                                fn();
                                            }
                                        });

                                        // user orgunits and children
                                        requests.push({
                                            url: encodeURI(contextPath + '/api/organisationUnits.json?userOnly=true&fields=id,' + namePropertyUrl + ',children[id,' + namePropertyUrl + ']&paging=false'),
                                            success(r) {
                                                var organisationUnits = JSON.parse(r.responseText).organisationUnits || [],
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
                                                }
                                                else if (console) {
                                                    console.log(GIS.i18n.user_is_not_assigned_to_any_organisation_units);
                                                }

                                                fn();
                                            }
                                        });

                                        // admin
                                        requests.push({
                                            url: init.contextPath + '/api/me/authorization/F_GIS_ADMIN',
                                            success(r) {
                                                init.user.isAdmin = (r.responseText === 'true');
                                                fn();
                                            }
                                        });

                                        // indicator groups
                                        requests.push({
                                            url: encodeURI(init.apiPath + 'indicatorGroups.json?fields=id,displayName~rename(name)&paging=false'),
                                            success(r) {
                                                init.indicatorGroups = JSON.parse(r.responseText).indicatorGroups || [];
                                                fn();
                                            }
                                        });

                                        // data element groups
                                        requests.push({
                                            url: encodeURI(init.apiPath + 'dataElementGroups.json?fields=id,' + namePropertyUrl + '&paging=false'),
                                            success(r) {
                                                init.dataElementGroups = JSON.parse(r.responseText).dataElementGroups || [];
                                                fn();
                                            }
                                        });

                                        // infrastructural indicator group
                                        requests.push({
                                            url: encodeURI(init.apiPath + 'configuration/infrastructuralIndicators.json'),
                                            success(r) {
                                                let obj;

                                                if (r.responseText) {
                                                    obj = JSON.parse(r.responseText);
                                                }

                                                init.systemSettings.infrastructuralIndicatorGroup = isObject(obj) ? obj : null;

                                                if (!isObject(obj)) {
                                                    Ext.Ajax.request({
                                                        url: encodeURI(init.apiPath + 'indicatorGroups.json?fields=id,displayName~rename(name),indicators[id,' + namePropertyUrl + ']&pageSize=1'),
                                                        success(r) {
                                                            r = JSON.parse(r.responseText);
                                                            init.systemSettings.infrastructuralIndicatorGroup = r.indicatorGroups ? r.indicatorGroups[0] : null;
                                                        },
                                                        callback: fn
                                                    });
                                                }
                                                else {
                                                    fn();
                                                }
                                            }
                                        });

                                        // infrastructural data element group
                                        requests.push({
                                            url: encodeURI(init.apiPath + 'configuration/infrastructuralDataElements.json'),
                                            success(r) {
                                                let obj;

                                                if (r.responseText) {
                                                    obj = JSON.parse(r.responseText);
                                                }

                                                init.systemSettings.infrastructuralDataElementGroup = isObject(obj) ? obj : null;

                                                if (!isObject(obj)) {
                                                    Ext.Ajax.request({
                                                        url: encodeURI(init.apiPath + 'dataElementGroups.json?fields=id,' + namePropertyUrl + ',dataElements[id,' + namePropertyUrl + ']&pageSize=1'),
                                                        success(r) {
                                                            r = JSON.parse(r.responseText);
                                                            init.systemSettings.infrastructuralDataElementGroup = r.dataElementGroups ? r.dataElementGroups[0] : null;
                                                        },
                                                        callback: fn
                                                    });
                                                }
                                                else {
                                                    fn();
                                                }
                                            }
                                        });

                                        // infrastructural period type
                                        requests.push({
                                            url: encodeURI(init.apiPath + 'configuration/infrastructuralPeriodType.json'),
                                            success(r) {


                                                var obj = JSON.parse(r.responseText);

                                                init.systemSettings.infrastructuralPeriodType = isObject(obj) ? obj : {id: 'Yearly', code: 'Yearly', name: 'Yearly'};
                                                fn();
                                            }
                                        });

                                        // option sets
                                        requests.push({
                                            url: '.',
                                            disableCaching: false,
                                            success() {
                                                var store = dhis2.gis.store;

                                                store.open().done( function() {

                                                    // check if idb has any option sets
                                                    store.getKeys('optionSets').done( function(keys) {
                                                        if (keys.length === 0) {
                                                            Ext.Ajax.request({
                                                                url: encodeURI(contextPath + '/api/optionSets.json?fields=id,displayName~rename(name),version,options[code,displayName~rename(name)]&paging=false'),
                                                                success(r) {
                                                                    var sets = JSON.parse(r.responseText).optionSets;

                                                                    if (sets.length) {
                                                                        store.setAll('optionSets', sets).done(fn);
                                                                    }
                                                                    else {
                                                                        fn();
                                                                    }
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            Ext.Ajax.request({
                                                                url: encodeURI(contextPath + '/api/optionSets.json?fields=id,version&paging=false'),
                                                                success(r) {
                                                                    var optionSets = JSON.parse(r.responseText).optionSets || [],
                                                                        ids = [],
                                                                        url = '',
                                                                        callbacks = 0,
                                                                        updateStore,
                                                                        registerOptionSet;

                                                                    updateStore = function() {
                                                                        if (++callbacks === optionSets.length) {
                                                                            if (!ids.length) {
                                                                                fn();
                                                                                return;
                                                                            }

                                                                            for (var i = 0; i < ids.length; i++) {
                                                                                url += '&filter=id:eq:' + ids[i];
                                                                            }

                                                                            Ext.Ajax.request({
                                                                                url: encodeURI(contextPath + '/api/optionSets.json?fields=id,displayName~rename(name),version,options[code,displayName~rename(name)]&paging=false' + url),
                                                                                success(r) {
                                                                                    var sets = JSON.parse(r.responseText).optionSets;

                                                                                    store.setAll('optionSets', sets).done(fn);
                                                                                }
                                                                            });
                                                                        }
                                                                    };

                                                                    registerOptionSet = function(optionSet) {
                                                                        store.get('optionSets', optionSet.id).done( function(obj) {
                                                                            if (!isObject(obj) || obj.version !== optionSet.version) {
                                                                                ids.push(optionSet.id);
                                                                            }

                                                                            updateStore();
                                                                        });
                                                                    };

                                                                    if (optionSets.length) {
                                                                        for (var i = 0; i < optionSets.length; i++) {
                                                                            registerOptionSet(optionSets[i]);
                                                                        }
                                                                    }
                                                                    else {
                                                                        fn();
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                        });

                                        for (var i = 0; i < requests.length; i++) {
                                            Ext.Ajax.request(requests[i]);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }());
});

export default null;