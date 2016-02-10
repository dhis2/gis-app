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
        applyCss,
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
            fn;

        init.contextPath = config.url;

        if (config.username && config.password) {
            Ext.Ajax.defaultHeaders = {
                'Authorization': 'Basic ' + btoa(config.username + ':' + config.password)
            };
        }

        fn = function() {
            if (++callbacks === requests.length) {
                isInitComplete = true;

                for (var i = 0; i < configs.length; i++) {
                    execute(configs[i]);
                }
            }
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

                                            Ext.Ajax.request(optionSetConfig);
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
                            Ext.Ajax.request(optionSetVersionConfig);
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

                Ext.Ajax.request(userAccountConfig);
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
            Ext.Ajax.request(requests[i]);
        }
    };

    applyCss = function() {
        var css = '';

        // needs parent class to avoid conflict
        css += '.x-border-box .gis-plugin * {box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-webkit-box-sizing:border-box} \n';

        // plugin
        css += '.gis-plugin, .gis-plugin * { font-family: arial, sans-serif, liberation sans, consolas; } \n';

        // ext gray
        css += 'table{border-collapse:collapse;border-spacing:0} \n';
        css += 'fieldset,img{border:0} \n';
        css += '*:focus{outline:none}';
        css += '.x-clear{overflow:hidden;clear:both;height:0;width:0;font-size:0;line-height:0} \n';
        css += '.x-layer{position:absolute;overflow:hidden;zoom:1} \n';
        css += '.x-css-shadow{position:absolute;-moz-border-radius:5px 5px;-webkit-border-radius:5px 5px;-o-border-radius:5px 5px;-ms-border-radius:5px 5px;-khtml-border-radius:5px 5px;border-radius:5px 5px} \n';
        css += '.x-frame-shadow *{overflow:hidden} \n';
        css += '.x-frame-shadow *{padding:0;border:0;margin:0;clear:none;zoom:1} \n';
        css += '.x-mask{z-index:100;position:absolute;top:0;left:0;filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50);opacity:0.5;width:100%;height:100%;zoom:1;background:#cccccc} \n';
        css += '.x-mask-msg{z-index:20001;position:absolute;top:0;left:0;padding:2px;border:1px solid;border-color:#d0d0d0;background-image:none;background-color:#e0e0e0} \n';
        css += '.x-mask-msg div{padding:5px 10px 5px 25px;background-image:url("' + init.contextPath + '/dhis-web-commons/javascripts/plugin/images/loading.gif");background-repeat:no-repeat;background-position:5px center;cursor:wait;border:1px solid #b3b3b3;background-color:#eeeeee;color:#222222;font:normal 11px tahoma, arial, verdana, sans-serif} \n';
        css += '.x-btn *{cursor:pointer;cursor:hand} \n';
        css += '.x-btn em a{text-decoration:none;display:inline-block;color:inherit} \n';
        css += '.x-btn-disabled span{filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50);opacity:0.5} \n';
        css += '.x-ie6 .x-btn-disabled span,.x-ie7 .x-btn-disabled span{filter:none} \n';
        css += '.x-btn button,.x-btn a{position:relative} \n';
        css += '.x-item-disabled,.x-item-disabled *{cursor:default} \n';
        css += '.x-datepicker a{-moz-outline:0 none;outline:0 none;color:#523a39;text-decoration:none;border-width:0} \n';
        css += '.x-datepicker-prev a,.x-datepicker-next a{display:block;width:16px;height:16px;background-position:top;background-repeat:no-repeat;cursor:pointer;text-decoration:none !important;filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=70);opacity:0.7} \n';
        css += '.x-datepicker-prev a:hover,.x-datepicker-next a:hover{filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity:1} \n';
        css += '.x-datepicker-next a{background-image:url("images/right-btn.gif")} \n';
        css += '.x-datepicker-prev a{background-image:url("images/left-btn.gif")} \n';
        css += '.x-item-disabled .x-datepicker-prev a:hover,.x-item-disabled .x-datepicker-next a:hover{filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=60);opacity:0.6} \n';
        css += '.x-datepicker-month span{color:#fff !important} \n';
        css += 'table.x-datepicker-inner th span{display:block;padding-right:7px} \n';
        css += 'table.x-datepicker-inner a{padding-right:4px;display:block;zoom:1;font:normal 11px tahoma, arial, verdana, sans-serif;color:black;text-decoration:none;text-align:right} \n';
        css += 'table.x-datepicker-inner .x-datepicker-selected a{background:repeat-x left top;background-color:#d8d8d8;border:1px solid #b2aaa9} \n';
        css += 'table.x-datepicker-inner .x-datepicker-selected span{font-weight:bold} \n';
        css += 'table.x-datepicker-inner .x-datepicker-today a{border:1px solid;border-color:darkred} \n';
        css += 'table.x-datepicker-inner .x-datepicker-prevday a,table.x-datepicker-inner .x-datepicker-nextday a{text-decoration:none !important;color:#aaa} \n';
        css += 'table.x-datepicker-inner a:hover,table.x-datepicker-inner .x-datepicker-disabled a:hover{text-decoration:none !important;color:#000;background-color:transparent} \n';
        css += 'table.x-datepicker-inner .x-datepicker-disabled a{cursor:default;background-color:#eee;color:#bbb} \n';
        css += '.x-item-disabled .x-datepicker-inner a:hover{background:none} \n';
        css += '.x-monthpicker-item a{display:block;margin:0 5px 0 5px;text-decoration:none;color:#523a39;border:1px solid white;line-height:17px} \n';
        css += '.x-monthpicker-item a:hover{background-color:transparent} \n';
        css += '.x-color-picker a{border:1px solid #fff;float:left;padding:2px;text-decoration:none;-moz-outline:0 none;outline:0 none;cursor:pointer} \n';
        css += '.x-color-picker a:hover,.x-color-picker a.x-color-picker-selected{border-color:#8bb8f3;background-color:#deecfd} \n';
        css += '.x-color-picker em span{cursor:pointer;display:block;height:10px;width:10px;line-height:10px} \n';
        css += '.x-menu-body{user-select:none;-o-user-select:none;-ms-user-select:none;-moz-user-select:-moz-none;-webkit-user-select:none;cursor:default;background:#f0f0f0 !important;padding:2px} \n';
        css += '.x-menu-focus{display:block;position:absolute;top:-10px;left:-10px;width:0px;height:0px} \n';
        css += '.x-menu-item{white-space:nowrap;overflow:hidden;z-index:1} \n';
        css += '.x-menu-item-link{display:block;margin:1px;padding:6px 2px 3px 32px;text-decoration:none !important;line-height:16px;cursor:default} \n';
        css += '.x-opera .x-menu-item-link{position:relative} \n';
        css += '.x-menu-item-icon{width:16px;height:16px;position:absolute;top:5px;left:4px;background:no-repeat center center} \n';
        css += '.x-menu-item-text{font-size:11px;color:#222222} \n';
        css += '.x-menu-item-active .x-menu-item-link{background-image:none;background-color:#e6e6e6;background-image:-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #eeeeee), color-stop(100%, #dcdcdc));background-image:-webkit-linear-gradient(top, #eeeeee,#dcdcdc);background-image:-moz-linear-gradient(top, #eeeeee,#dcdcdc);background-image:-o-linear-gradient(top, #eeeeee,#dcdcdc);background-image:-ms-linear-gradient(top, #eeeeee,#dcdcdc);background-image:linear-gradient(top, #eeeeee,#dcdcdc);margin:0px;border:1px solid #9d9d9d;cursor:pointer;-moz-border-radius:3px;-webkit-border-radius:3px;-o-border-radius:3px;-ms-border-radius:3px;-khtml-border-radius:3px;border-radius:3px} \n';
        css += '.x-menu-item-disabled{filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50);opacity:0.5} \n';
        css += '.x-ie6 .x-menu-item-link,.x-ie7 .x-menu-item-link,.x-quirks .x-ie8 .x-menu-item-link{padding-bottom:2px} \n';
        css += '.x-nlg .x-menu-item-active .x-menu-item-link{background:#e6e6e6 repeat-x left top;background-image:url("images/menu-item-active-bg.gif")} \n';
        css += '.x-unselectable{user-select:none;-o-user-select:none;-ms-user-select:none;-moz-user-select:-moz-none;-webkit-user-select:none;cursor:default} \n';
        css += '.x-grid-row-editor .x-panel-body{background-color:#ebe6e6;border-top:1px solid #d0d0d0 !important;border-bottom:1px solid #d0d0d0 !important} \n';
        css += '.x-webkit *:focus{outline:none !important} \n';
        css += '.x-ie .x-fieldset-noborder legend span{position:absolute;left:16px} \n';
        css += '.x-panel,.x-plain{overflow:hidden;position:relative} \n';
        css += '.x-panel-header{padding:5px 4px 4px 5px} \n';
        css += '.x-panel-header-horizontal .x-panel-header-body,.x-panel-header-horizontal .x-window-header-body,.x-panel-header-horizontal .x-btn-group-header-body,.x-window-header-horizontal .x-panel-header-body,.x-window-header-horizontal .x-window-header-body,.x-window-header-horizontal .x-btn-group-header-body,.x-btn-group-header-horizontal .x-panel-header-body,.x-btn-group-header-horizontal .x-window-header-body,.x-btn-group-header-horizontal .x-btn-group-header-body{width:100%} \n';
        css += '.x-panel-header-text-container{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis} \n';
        css += '.x-panel-header-text{user-select:none;-o-user-select:none;-ms-user-select:none;-moz-user-select:-moz-none;-webkit-user-select:none;cursor:default;white-space:nowrap} \n';
        css += '.x-panel-body{overflow:hidden;position:relative;font-size:12px} \n';
        css += '.x-panel-collapsed .x-panel-header-collapsed-border-top{border-bottom-width:1px !important} \n';
        css += '.x-panel-default{border-color:#d0d0d0} \n';
        css += '.x-panel-header-default{font-size:11px;line-height:15px;border-color:#d0d0d0;border-width:1px;border-style:solid;background-image:none;background-color:#d7d2d2;background-image:-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #f0f0f0), color-stop(100%, #d7d7d7));background-image:-webkit-linear-gradient(top, #f0f0f0,#d7d7d7);background-image:-moz-linear-gradient(top, #f0f0f0,#d7d7d7);background-image:-o-linear-gradient(top, #f0f0f0,#d7d7d7);background-image:-ms-linear-gradient(top, #f0f0f0,#d7d7d7);background-image:linear-gradient(top, #f0f0f0,#d7d7d7);-moz-box-shadow:#efeded 0 1px 0px 0 inset;-webkit-box-shadow:#efeded 0 1px 0px 0 inset;-o-box-shadow:#efeded 0 1px 0px 0 inset;box-shadow:#efeded 0 1px 0px 0 inset} \n';
        css += '.x-panel-header-text-default{color:#333333;font-size:11px;font-weight:bold;font-family:tahoma, arial, verdana, sans-serif} \n';
        css += '.x-panel-collapsed .x-window-header-default,.x-panel-collapsed .x-panel-header-default{border-color:#d0d0d0} \n';
        css += '.x-panel-collapsed .x-panel-header-default-top{-moz-border-radius-bottomleft:null;-webkit-border-bottom-left-radius:null;-o-border-bottom-left-radius:null;-ms-border-bottom-left-radius:null;-khtml-border-bottom-left-radius:null;border-bottom-left-radius:null;-moz-border-radius-bottomright:null;-webkit-border-bottom-right-radius:null;-o-border-bottom-right-radius:null;-ms-border-bottom-right-radius:null;-khtml-border-bottom-right-radius:null;border-bottom-right-radius:null} \n';
        css += '.x-panel-header-default-top{-moz-box-shadow:#efeded 0 1px 0px 0 inset;-webkit-box-shadow:#efeded 0 1px 0px 0 inset;-o-box-shadow:#efeded 0 1px 0px 0 inset;box-shadow:#efeded 0 1px 0px 0 inset} \n';
        css += '.x-tip-header a,.x-tip-body a,.x-form-invalid-tip-body a{color:#2a2a2a} \n';
        css += '.x-toolbar-footer .x-box-inner{border-width:0} \n';
        css += '.x-window-default{-moz-border-radius-topleft:5px; -webkit-border-top-left-radius:5px; -o-border-top-left-radius:5px; -ms-border-top-left-radius:5px; -khtml-border-top-left-radius:5px; border-top-left-radius:5px; -moz-border-radius-topright:5px; -webkit-border-top-right-radius:5px; -o-border-top-right-radius:5px; -ms-border-top-right-radius:5px; -khtml-border-top-right-radius:5px; border-top-right-radius:5px; -moz-border-radius-bottomright:5px; -webkit-border-bottom-right-radius:5px; -o-border-bottom-right-radius:5px; -ms-border-bottom-right-radius:5px; -khtml-border-bottom-right-radius:5px; border-bottom-right-radius:5px; -moz-border-radius-bottomleft:5px; -webkit-border-bottom-left-radius:5px; -o-border-bottom-left-radius:5px; -ms-border-bottom-left-radius:5px; -khtml-border-bottom-left-radius:5px; border-bottom-left-radius:5px; -moz-box-shadow:#ebe7e7 0 1px 0px 0 inset, #ebe7e7 0 -1px 0px 0 inset, #ebe7e7 -1px 0 0px 0 inset, #ebe7e7 1px 0 0px 0 inset; -webkit-box-shadow:#ebe7e7 0 1px 0px 0 inset, #ebe7e7 0 -1px 0px 0 inset, #ebe7e7 -1px 0 0px 0 inset, #ebe7e7 1px 0 0px 0 inset; -o-box-shadow:#ebe7e7 0 1px 0px 0 inset, #ebe7e7 0 -1px 0px 0 inset, #ebe7e7 -1px 0 0px 0 inset, #ebe7e7 1px 0 0px 0 inset; box-shadow:#ebe7e7 0 1px 0px 0 inset, #ebe7e7 0 -1px 0px 0 inset, #ebe7e7 -1px 0 0px 0 inset, #ebe7e7 1px 0 0px 0 inset; padding:4px 4px 4px 4px; border-color:#a9a9a9; border-width:1px; border-style:solid; background-color:#e8e8e8; } \n';
        css += '.x-window{outline:none} \n';
        css += '.x-window-header-default { border-color: #a9a9a9; zoom: 1; } \n';
        css += '.x-window-header-default-top { box-shadow: #ebe7e7 0 1px 0px 0 inset, #ebe7e7 -1px 0 0px 0 inset, #ebe7e7 1px 0 0px 0 inset; border-bottom-left-radius: 0; padding: 5px 5px 0 5px; border-width: 1px; border-style: solid; background-color: #e8e8e8; } \n';
        css += '.x-window .x-window-wrap .x-window-body{overflow:hidden} \n';
        css += '.x-window-body-default{border-color:#bcb1b0;border-width:1px;background:#e0e0e0;color:black} \n';
        css += '.x-window-body{position:relative;border-style:solid} \n';
        css += '.x-message-box .x-window-body{background-color:#e8e8e8;border:none} \n';
        css += '.x-tab-bar-bottom .x-tab-bar-body .x-box-inner{position:relative;top:-1px} \n';
        css += '.x-tab-bar-bottom .x-tab-bar-body-default-plain .x-box-inner{position:relative;top:-1px} \n';
        css += '.x-tab *{cursor:pointer;cursor:hand} \n';
        css += '.x-tab-default-disabled *{cursor:default} \n';
        css += '.x-tab button,.x-tab a{position:relative} \n';
        css += '.x-grid-tree-loading span{font-style:italic;color:#444444} \n';
        css += '.x-proxy-el{position:absolute;background:#b4b4b4;filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=80);opacity:0.8} \n';
        css += '.x-docked{position:absolute;z-index:1} \n';
        css += '.x-docked-top{border-bottom-width:0 !important} \n';
        css += '.x-box-inner{overflow:hidden;zoom:1;position:relative;left:0;top:0} \n';
        css += '.x-box-item{position:absolute !important;left:0;top:0} \n';
        css += '.x-box-layout-ct,.x-border-layout-ct{overflow:hidden;zoom:1} \n';
        css += '.x-inline-children > *{display:inline-block !important} \n';
        css += '.x-tool{height:15px} \n';
        css += '.x-tool img{overflow:hidden;width:15px;height:15px;cursor:pointer;background-color:transparent;background-repeat:no-repeat;background-image:url("images/tool-sprites.gif");margin:0} \n';
        css += '.x-panel-header-horizontal .x-tool,.x-window-header-horizontal .x-tool{margin-left:2px} \n';
        css += '.x-tool-expand-bottom,.x-tool-collapse-bottom{background-position:0 -195px} \n';
        css += '.x-tool-expand-top,.x-tool-collapse-top{background-position:0 -210px} \n';
        css += '.x-html html,.x-html address,.x-html blockquote,.x-html body,.x-html dd,.x-html div,.x-html dl,.x-html dt,.x-html fieldset,.x-html form,.x-html frame,.x-html frameset,.x-html h1,.x-html h2,.x-html h3,.x-html h4,.x-html h5,.x-html h6,.x-html noframes,.x-html ol,.x-html p,.x-html ul,.x-html center,.x-html dir,.x-html hr,.x-html menu,.x-html pre{display:block} \n';
        css += '.x-html :before,.x-html :after{white-space:pre-line} \n';
        css += '.x-html :link,.x-html :visited{text-decoration:underline} \n';
        css += '.x-panel-header-draggable,.x-panel-header-draggable .x-panel-header-text,.x-window-header-draggable,.x-window-header-draggable .x-window-header-text,.x-tip-header-draggable .x-tip-header-text { cursor:move; } \n';
        css += '.x-panel-header-vertical,.x-panel-header-vertical .x-panel-header-body,.x-btn-group-header-vertical,.x-btn-group-header-vertical .x-btn-group-header-body,.x-window-header-vertical,.x-window-header-vertical .x-window-header-body,.x-html button,.x-html textarea,.x-html input,.x-html select { display:inline-block; } \n';
        css += '.x-window-header-text { user-select:none; -o-user-select:none; -ms-user-select:none; -moz-user-select:0; -webkit-user-select:none; cursor:default; white-space:nowrap; display:block; } \n';
        css += '.x-box-inner { zoom: 1; } \n';
        css += '.x-panel-default { border-color: #d0d0d0; } \n';
        css += '.x-panel { overflow: hidden; } \n';
        css += '.x-panel-body { overflow: hidden; position: relative; } \n';
        //css += '.x-panel-body-default { background: white; border-color: #d0d0d0; color: black; border-width: 1px; border-style: solid; } \n';
        css += '.x-panel-body, .x-window-body * { font-size: 11px; } \n';
        css += '.x-panel-header-default { line-height: 15px; border-color: #d0d0d0; border-width: 1px; border-style: solid; } \n';
        css += '.x-panel-header { height: 30px; padding: 7px 4px 4px 7px; border: 0 none; } \n';
        css += '.x-panel-header-text-default { color: #333333; font-weight: bold; } \n';
        css += '.x-panel-header-text { -webkit-user-select: none; cursor: default; white-space: nowrap; } \n';
        css += '.x-box-item { position: absolute !important; } \n';
        css += '.x-unselectable { -webkit-user-select: none; cursor: default; } \n';
        css += '.x-docked { position: absolute; z-index: 1; } \n';
        css += '.x-docked-top { border-bottom-width: 0 !important; } \n';

        // gis
        css += '.x-mask-msg { padding: 0; border: 0 none; background-image: none; background-color: transparent; } \n';
        css += '.x-mask-msg div { background-position: 11px center; } \n';
        css += '.x-mask-msg .x-mask-loading { border: 0 none; background-color: #000; color: #fff; border-radius: 2px; padding: 12px 14px 12px 30px; opacity: 0.65; } \n';
        css += '.gis-window-widget-feature { padding: 0; border: 0 none; border-radius: 0; background: transparent; box-shadow: none; } \n';
        css += '.gis-window-widget-feature .x-window-body-default { border: 0 none; background: transparent; } \n';
        css += '.gis-window-widget-feature .x-window-body-default .x-panel-body-default { border: 0 none; background: #556; opacity: 0.92; filter: alpha(opacity=92); -ms-filter: "alpha(opacity=92)"; padding: 5px 8px 4px 8px; border-bottom-left-radius: 2px; border-bottom-right-radius: 2px; color: #fff; font-weight: bold; letter-spacing: 1px; } \n';
        css += '.x-menu-body { border:1px solid #bbb; border-radius: 2px; padding: 0; background-color: #fff !important; } \n';
        css += '.x-menu-item-active .x-menu-item-link {	border-radius: 0; border-color: #e1e1e1; background-color: #e1e1e1; background-image: none; } \n';
        css += '.x-menu-item-link { padding: 4px 5px 4px 26px; } \n';
        css += '.x-menu-item-text { color: #111; } \n';
        css += '.disabled { opacity: 0.4; cursor: default !important; } \n';
        css += '.el-opacity-1 { opacity: 1 !important; } \n';
        css += '.el-border-0, .el-border-0 .x-panel-body { border: 0 none !important; } \n';
        css += '.el-fontsize-10 { font-size: 10px !important; } \n';
        css += '.gis-grid-row-icon-disabled * { cursor: default !important; } \n';
        css += '.gis-toolbar-btn-menu { margin-top: 4px; } \n';
        css += '.gis-toolbar-btn-menu .x-panel-body-default { border-radius: 2px; border-color: #999; } \n';
        css += '.gis-grid .link, .gis-grid .link * { cursor: pointer; cursor: hand; color: blue; text-decoration: underline; } \n';
        css += '.gis-menu-item-icon-drill, .gis-menu-item-icon-float { left: 6px; } \n';
        css += '.gis-menu-item-first.x-menu-item-active .x-menu-item-link {	border-radius: 0; border-top-left-radius: 2px; border-top-right-radius: 2px; } \n';
        css += '.gis-menu-item-last.x-menu-item-active .x-menu-item-link { border-radius: 0; border-bottom-left-radius: 2px; border-bottom-right-radius: 2px; } \n';
        css += '.gis-menu-item-icon-drill { background: url("' + init.contextPath + '/dhis-web-commons/javascripts/plugin/images/drill_16.png") no-repeat; } \n';
        css += '.gis-menu-item-icon-float { background: url("' + init.contextPath + '/dhis-web-commons/javascripts/plugin/images/float_16.png") no-repeat; } \n';
        css += '.x-color-picker a { padding: 0; } \n';
        css += '.x-color-picker em span { width: 14px; height: 14px; } \n';
        css += '.gis-panel-legend .x-panel-header { height: 23px; background: #f1f1f1; padding: 4px 4px 0 5px} \n';
        css += '.gis-panel-legend .x-panel-header .x-panel-header-text { font-size: 10px; } \n';

        // alert
        css += '.ns-plugin-alert { width: 90%; padding: 5%; color: #777 } \n';

        Ext.util.CSS.createStyleSheet(css);
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
                bodyStyle: 'border: 1px solid #d0d0d0',
                width: el.getWidth() - eastWidth,
                afterLayout: function() {
                    if (!this.map) {
                        this.map = gis.instance;
                        this.body.appendChild(this.map.getContainer());
                        this.map.invalidateSize();
                    } else {
                        this.map.invalidateSize();
                    }
                }
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

            // base layer
            gis.map.baseLayer = gis.map.baseLayer || 'none';

            var base = Ext.isString(gis.map.baseLayer) ? gis.map.baseLayer.split(' ').join('').toLowerCase() : gis.map.baseLayer;

            if (!base || base === 'none' || base === 'off') {
                gis.instance.addLayer(gis.layer.openStreetMap.config);
            }
            else if (base === 'gs' || base === 'googlestreets') {
                gis.instance.addLayer(gis.layer.googleStreets.config);
            }
            else if (base === 'gh' || base === 'googlehybrid') {
                gis.instance.addLayer(gis.layer.googleHybrid.config);
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
            applyCss();

            // core
            gis = GIS.core.getInstance(init, appConfig);
            extendInstance(gis, appConfig);

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