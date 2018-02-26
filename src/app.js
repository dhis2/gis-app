import GIS from './core/index.js';
import app from './app/index.js';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';
import log from 'loglevel';

log.setLevel(log.levels.INFO); // TODO: Use DEBUG for development
log.info('Loading: GIS app 29.0.4'); // TODO: Use manifest

window.GIS = GIS;

GIS.app = app;

Ext.onReady( function() {
    var createViewport,
        gis;

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

    createViewport = function() {
        var centerRegion,
            eastRegion,
            downloadButton,
            shareButton,
            aboutButton,
            defaultButton,
            interpretationItem,
            pluginItem,
            favoriteUrlItem,
            apiUrlItem,
            layersPanel,
            resizeButton,
            viewport,
            onRender,
            afterRender;

        resizeButton = Ext.create('Ext.button.Button', {
            text: '>>>',
            handler: function() {
                eastRegion.toggleCollapse();
            }
        });

        defaultButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.map,
            iconCls: 'gis-button-icon-map',
            toggleGroup: 'module',
            pressed: true,
            menu: {},
            handler(b) {
                b.menu = Ext.create('Ext.menu.Menu', {
                    closeAction: 'destroy',
                    shadow: false,
                    showSeparator: false,
                    items: [
                        {
                            text: GIS.i18n.clear_map + '&nbsp;&nbsp;', //i18n
                            cls: 'gis-menu-item-noicon',
                            handler: function() {
                                window.location.href = gis.init.contextPath + '/dhis-web-mapping';
                            }
                        }
                    ],
                    listeners: {
                        show: function() {
                            gis.util.gui.window.setAnchorPosition(b.menu, b);
                        },
                        hide: function() {
                            b.menu.destroy();
                            defaultButton.toggle();
                        },
                        destroy: function(m) {
                            b.menu = null;
                        }
                    }
                });

                b.menu.show();
            }
        });

        interpretationItem = Ext.create('Ext.menu.Item', {
            text: 'Write interpretation' + '&nbsp;&nbsp;',
            iconCls: 'gis-menu-item-tablelayout',
            disabled: true,
            xable() {
                if (gis.map) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            },
            handler() {
                if (viewport.interpretationWindow) {
                    viewport.interpretationWindow.destroy();
                    viewport.interpretationWindow = null;
                }

                viewport.interpretationWindow = GIS.app.InterpretationWindow(gis);
                viewport.interpretationWindow.show();
            }
        });

        pluginItem = Ext.create('Ext.menu.Item', {
            text: 'Embed in web page' + '&nbsp;&nbsp;',
            iconCls: 'gis-menu-item-datasource',
            disabled: true,
            xable() {
                if (gis.instance.getLayersBounds().isValid() || (gis.layer.earthEngine.instance && gis.instance.hasLayer(gis.layer.earthEngine.instance))) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            },
            handler() {
                var textArea,
                    window,
                    text = '',
                    el = 'map',
                    layout = gis.util.map.map2plugin(gis.util.layout.getPluginConfig()),
                    version = function() {
                        var versionArray = gis.init.systemInfo.version.split('.');

                        var major = versionArray[0];
                        var minor = parseInt(versionArray[1]) - 1;

                        return 'v' + major + minor;
                    }();

                layout.el = el;

                if (layout.mapViews) {
                    for (var i = 0, view; i < layout.mapViews.length; i++) {
                        view = layout.mapViews[i];

                        if (view.legendSet) {
                            delete view.legendSet.bounds;
                            delete view.legendSet.colors;
                            delete view.legendSet.names;
                        }

                        if (!view.labels) {
                            delete view.labels;
                            delete view.labelFontSize;
                            delete view.labelFontWeight;
                            delete view.labelFontStyle;
                            delete view.labelFontColor;
                        }
                    }
                }

                layout.url = '<url to server>';
                layout.username = '<username>';
                layout.password = '<password>';

                text += '<html>\n<head>\n';
                text += '<link rel="stylesheet" href="http://dhis2-cdn.org/v222/ext/resources/css/ext-plugin-gray.css" />\n';
                text += '<script src="http://dhis2-cdn.org/v222/ext/ext-all.js"></script>\n';
                text += '<script src="http://dhis2-cdn.org/' + version + '/plugin/map.js"></script>\n';
                text += '</head>\n\n<body>\n';
                text += '<div id="' + el + '"></div>\n\n';
                text += '<script>\n\n';
                text += 'Ext.onReady(function() {\n\n';
                text += 'DHIS.getMap(' + JSON.stringify(layout, null, 2) + ');\n\n';
                text += '});\n\n';
                text += '</script>\n\n';
                text += '</body>\n</html>';

                textArea = Ext.create('Ext.form.field.TextArea', {
                    width: 700,
                    height: 400,
                    readOnly: true,
                    cls: 'ns-textarea monospaced',
                    value: text
                });

                window = Ext.create('Ext.window.Window', {
                    title: 'Embed in web page' + (gis.map && gis.map.name ? '<span style="font-weight:normal">&nbsp;|&nbsp;&nbsp;' + gis.map.name + '</span>' : ''),
                    layout: 'fit',
                    modal: true,
                    resizable: false,
                    items: textArea,
                    destroyOnBlur: true,
                    bbar: [
                        '->',
                        {
                            text: 'Select',
                            handler: function() {
                                textArea.selectText();
                            }
                        }
                    ],
                    listeners: {
                        show: function(w) {
                            this.setPosition(215, 33);

                            if (!w.hasDestroyOnBlurHandler) {
                                gis.util.gui.window.addDestroyOnBlurHandler(w);
                            }
                        }
                    }
                });

                window.show();
            }
        });

        favoriteUrlItem = Ext.create('Ext.menu.Item', {
            text: 'Favorite link' + '&nbsp;&nbsp;',
            iconCls: 'gis-menu-item-datasource',
            disabled: true,
            xable() {
                if (gis.map && gis.map.id) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            },
            handler() {
                var url = encodeURI(gis.init.contextPath + '/dhis-web-mapping/index.html?id=' + gis.map.id),
                    textField,
                    window;

                textField = Ext.create('Ext.form.field.Text', {
                    html: '<a class="user-select td-nobreak" target="_blank" href="' + url + '">' + url + '</a>'
                });

                window = Ext.create('Ext.window.Window', {
                    title: 'Favorite link' + '<span style="font-weight:normal">&nbsp;|&nbsp;&nbsp;' + gis.map.name + '</span>',
                    layout: 'fit',
                    modal: true,
                    resizable: false,
                    destroyOnBlur: true,
                    bodyStyle: 'padding: 12px 18px; background-color: #fff; font-size: 11px',
                    html: '<a class="user-select td-nobreak" target="_blank" href="' + url + '">' + url + '</a>',
                    listeners: {
                        show: function(w) {
                            this.setPosition(325, 33);

                            if (!w.hasDestroyOnBlurHandler) {
                                gis.util.gui.window.addDestroyOnBlurHandler(w);
                            }

                            document.body.oncontextmenu = true;
                        },
                        hide: function() {
                            document.body.oncontextmenu = function(){return false;};
                        }
                    }
                });

                window.show();
            }
        });

        apiUrlItem = Ext.create('Ext.menu.Item', {
            text: 'API link' + '&nbsp;&nbsp;',
            iconCls: 'gis-menu-item-datasource',
            disabled: true,
            xable() {
                if (gis.map && gis.map.id) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            },
            handler() {
                var url = gis.init.apiPath + 'maps/' + gis.map.id + '/data',
                    textField,
                    window;

                textField = Ext.create('Ext.form.field.Text', {
                    html: '<a class="user-select td-nobreak" target="_blank" href="' + url + '">' + url + '</a>'
                });

                window = Ext.create('Ext.window.Window', {
                    title: 'API link' + '<span style="font-weight:normal">&nbsp;|&nbsp;&nbsp;' + gis.map.name + '</span>',
                    layout: 'fit',
                    modal: true,
                    resizable: false,
                    destroyOnBlur: true,
                    bodyStyle: 'padding: 12px 18px; background-color: #fff; font-size: 11px',
                    html: '<a class="user-select td-nobreak" target="_blank" href="' + url + '">' + url + '</a>',
                    listeners: {
                        show: function(w) {
                            this.setPosition(325, 33);

                            if (!w.hasDestroyOnBlurHandler) {
                                gis.util.gui.window.addDestroyOnBlurHandler(w);
                            }

                            document.body.oncontextmenu = true;
                        },
                        hide: function() {
                            document.body.oncontextmenu = function(){return false;};
                        }
                    }
                });

                window.show();
            }
        });

        shareButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.share,
            disabled: true,
            xableItems() {
                interpretationItem.xable();
                pluginItem.xable();
                favoriteUrlItem.xable();
                apiUrlItem.xable();
            },
            menu: {
                cls: 'gis-menu',
                shadow: false,
                showSeparator: false,
                items: [
                    interpretationItem,
                    pluginItem,
                    favoriteUrlItem,
                    apiUrlItem
                ],
                listeners: {
                    afterrender() {
                        this.getEl().addCls('gis-toolbar-btn-menu');
                    },
                    show() {
                        shareButton.xableItems();
                    }
                }
            }
        });

        aboutButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.about,
            menu: {},
            handler() {
                if (viewport.aboutWindow && viewport.aboutWindow.destroy) {
                    viewport.aboutWindow.destroy();
                    viewport.aboutWindow = null;
                }

                viewport.aboutWindow = GIS.app.AboutWindow(gis);
                viewport.aboutWindow.show();
            }
        });

        centerRegion = Ext.create('Ext.panel.Panel', {
            region: 'center',
            mapApi: gis.api,
            fullSize: true,
            cmp: [defaultButton],
            trash: [],
            toggleCmp(show) {
                for (var i = 0; i < this.cmp.length; i++) {
                    if (show) {
                        this.cmp[i].show();
                    }
                    else {
                        this.cmp[i].hide();
                    }
                }
            },
            tbar: {
                defaults: {
                    height: 26
                },
                style: 'padding-left:5px;',
                items: function() {
                    var a = [];
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.event.id,
                        menu: gis.layer.event.menu,
                        tooltip: GIS.i18n.event_layer,
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.facility.id,
                        menu: gis.layer.facility.menu,
                        tooltip: GIS.i18n.symbol_layer,
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.thematic1.id,
                        menu: gis.layer.thematic1.menu,
                        tooltip: GIS.i18n.thematic_layer + ' 1',
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.thematic2.id,
                        menu: gis.layer.thematic2.menu,
                        tooltip: GIS.i18n.thematic_layer + ' 2',
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.thematic3.id,
                        menu: gis.layer.thematic3.menu,
                        tooltip: GIS.i18n.thematic_layer + ' 3',
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.thematic4.id,
                        menu: gis.layer.thematic4.menu,
                        tooltip: GIS.i18n.thematic_layer + ' 4',
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.boundary.id,
                        menu: gis.layer.boundary.menu,
                        tooltip: GIS.i18n.boundary_layer,
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.earthEngine.id,
                        menu: gis.layer.earthEngine.menu,
                        tooltip: GIS.i18n.earthengine_layer,
                        width: 26
                    });
                    a.push({
                        iconCls: 'gis-btn-icon-' + gis.layer.external.id,
                        menu: gis.layer.external.menu,
                        tooltip: GIS.i18n.external_layer,
                        width: 26
                    });
                    a.push({
                        text: GIS.i18n.favorites,
                        menu: {},
                        handler: function() {
                            if (viewport.favoriteWindow && viewport.favoriteWindow.destroy) {
                                viewport.favoriteWindow.destroy();
                            }

                            viewport.favoriteWindow = GIS.app.FavoriteWindow(gis);
                            viewport.favoriteWindow.show();
                        }
                    });
                    a.push({
                        xtype: 'tbseparator',
                        height: 18,
                        style: 'border-color: transparent #d1d1d1 transparent transparent; margin-right: 4px',
                    });

                    // https://github.com/dhis2/dhis2-gis/issues/7
                    /*
                    a.push({
                        text: GIS.i18n.download,
                        menu: {},
                        disabled: true,
                        handler: function() {
                            if (viewport.downloadWindow && viewport.downloadWindow.destroy) {
                                viewport.downloadWindow.destroy();
                            }

                            viewport.downloadWindow = GIS.app.DownloadWindow(gis);
                            viewport.downloadWindow.show();
                        },
                        xable: function() {
                            if (gis.instance.getLayersBounds().isValid()) {
                                this.enable();
                            }
                            else {
                                this.disable();
                            }
                        },
                        listeners: {
                            added: function() {
                                downloadButton = this;
                            }
                        }
                    });
                    */

                    a.push(shareButton);
                    a.push('->');

                    a.push({
                        text: GIS.i18n.table,
                        iconCls: 'gis-button-icon-table',
                        toggleGroup: 'module',
                        menu: {},
                        handler: function(b) {
                            b.menu = Ext.create('Ext.menu.Menu', {
                                closeAction: 'destroy',
                                shadow: false,
                                showSeparator: false,
                                items: [
                                    {
                                        text: GIS.i18n.go_to_pivot_tables + '&nbsp;&nbsp;',
                                        cls: 'gis-menu-item-noicon',
                                        listeners: {
                                            render: function(b) {
                                                this.getEl().dom.addEventListener('click', function(e) {
                                                    if (!b.disabled) {
                                                        if (e.button === 0 && !e.ctrlKey) {
                                                            window.location.href = gis.init.contextPath + '/dhis-web-pivot';
                                                        }
                                                        else if ((e.ctrlKey && arrayContains([0,1], e.button)) || (!e.ctrlKey && e.button === 1)) {
                                                            window.open(gis.init.contextPath + '/dhis-web-pivot', '_blank');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    '-',
                                    {
                                        text: GIS.i18n.open_this_map_as_table + '&nbsp;&nbsp;',
                                        cls: 'gis-menu-item-noicon',
                                        disabled: !(GIS.isSessionStorage && gis.util.layout.getAnalytical()),
                                        listeners: {
                                            render: function(b) {
                                                this.getEl().dom.addEventListener('click', function(e) {
                                                    if (!b.disabled && GIS.isSessionStorage) {
                                                        gis.util.layout.setSessionStorage('analytical', gis.util.layout.getAnalytical());

                                                        if (e.button === 0 && !e.ctrlKey) {
                                                            window.location.href = gis.init.contextPath + '/dhis-web-pivot/index.html?s=analytical';
                                                        }
                                                        else if ((e.ctrlKey && arrayContains([0,1], e.button)) || (!e.ctrlKey && e.button === 1)) {
                                                            window.open(gis.init.contextPath + '/dhis-web-pivot/index.html?s=analytical', '_blank');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        text: GIS.i18n.open_last_table + '&nbsp;&nbsp;',
                                        cls: 'gis-menu-item-noicon',
                                        disabled: !(GIS.isSessionStorage && JSON.parse(sessionStorage.getItem('dhis2')) && JSON.parse(sessionStorage.getItem('dhis2'))['table']),
                                        listeners: {
                                            render: function(b) {
                                                this.getEl().dom.addEventListener('click', function(e) {
                                                    if (!b.disabled) {
                                                        if (e.button === 0 && !e.ctrlKey) {
                                                            window.location.href = gis.init.contextPath + '/dhis-web-pivot/index.html?s=table';
                                                        }
                                                        else if ((e.ctrlKey && arrayContains([0,1], e.button)) || (!e.ctrlKey && e.button === 1)) {
                                                            window.open(gis.init.contextPath + '/dhis-web-pivot/index.html?s=table', '_blank');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                ],
                                listeners: {
                                    show: function() {
                                        gis.util.gui.window.setAnchorPosition(b.menu, b);
                                    },
                                    hide: function() {
                                        b.menu.destroy();
                                        defaultButton.toggle();
                                    },
                                    destroy: function(m) {
                                        b.menu = null;
                                    }
                                }
                            });

                            b.menu.show();
                        },
                        listeners: {
                            render: function() {
                                centerRegion.cmp.push(this);
                            }
                        }
                    });

                    a.push({
                        text: GIS.i18n.chart,
                        iconCls: 'gis-button-icon-chart',
                        toggleGroup: 'module',
                        menu: {},
                        handler: function(b) {
                            b.menu = Ext.create('Ext.menu.Menu', {
                                closeAction: 'destroy',
                                shadow: false,
                                showSeparator: false,
                                items: [
                                    {
                                        text: GIS.i18n.go_to_charts + '&nbsp;&nbsp;',
                                        cls: 'gis-menu-item-noicon',
                                        listeners: {
                                            render: function(b) {
                                                this.getEl().dom.addEventListener('click', function(e) {
                                                    if (!b.disabled) {
                                                        if (e.button === 0 && !e.ctrlKey) {
                                                            window.location.href = gis.init.contextPath + '/dhis-web-visualizer';
                                                        }
                                                        else if ((e.ctrlKey && arrayContains([0,1], e.button)) || (!e.ctrlKey && e.button === 1)) {
                                                            window.open(gis.init.contextPath + '/dhis-web-visualizer', '_blank');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    '-',
                                    {
                                        text: GIS.i18n.open_this_map_as_chart + '&nbsp;&nbsp;',
                                        cls: 'gis-menu-item-noicon',
                                        disabled: !GIS.isSessionStorage || !gis.util.layout.getAnalytical(),
                                        listeners: {
                                            render: function(b) {
                                                this.getEl().dom.addEventListener('click', function(e) {
                                                    if (!b.disabled && GIS.isSessionStorage) {
                                                        gis.util.layout.setSessionStorage('analytical', gis.util.layout.getAnalytical());

                                                        if (e.button === 0 && !e.ctrlKey) {
                                                            window.location.href = gis.init.contextPath + '/dhis-web-visualizer/index.html?s=analytical';
                                                        }
                                                        else if ((e.ctrlKey && arrayContains([0,1], e.button)) || (!e.ctrlKey && e.button === 1)) {
                                                            window.open(gis.init.contextPath + '/dhis-web-visualizer/index.html?s=analytical', '_blank');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        text: GIS.i18n.open_last_chart + '&nbsp;&nbsp;',
                                        cls: 'gis-menu-item-noicon',
                                        disabled: !(GIS.isSessionStorage && JSON.parse(sessionStorage.getItem('dhis2')) && JSON.parse(sessionStorage.getItem('dhis2'))['chart']),
                                        listeners: {
                                            render: function(b) {
                                                this.getEl().dom.addEventListener('click', function(e) {
                                                    if (!b.disabled) {
                                                        if (e.button === 0 && !e.ctrlKey) {
                                                            window.location.href = gis.init.contextPath + '/dhis-web-visualizer/index.html?s=chart';
                                                        }
                                                        else if ((e.ctrlKey && arrayContains([0,1], e.button)) || (!e.ctrlKey && e.button === 1)) {
                                                            window.open(gis.init.contextPath + '/dhis-web-visualizer/index.html?s=chart', '_blank');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                ],
                                listeners: {
                                    show: function() {
                                        gis.util.gui.window.setAnchorPosition(b.menu, b);
                                    },
                                    hide: function() {
                                        b.menu.destroy();
                                        defaultButton.toggle();
                                    },
                                    destroy: function(m) {
                                        b.menu = null;
                                    }
                                }
                            });

                            b.menu.show();
                        },
                        listeners: {
                            render: function() {
                                centerRegion.cmp.push(this);
                            }
                        }
                    });

                    a.push(defaultButton);

                    a.push({
                        xtype: 'tbseparator',
                        height: 18,
                        style: 'border-color: transparent #d1d1d1 transparent transparent; margin-right: 6px; margin-left: 3px',
                        listeners: {
                            render: function() {
                                centerRegion.cmp.push(this);
                            }
                        }
                    });

                    a.push(aboutButton);

                    a.push({
                        xtype: 'button',
                        text: GIS.i18n.home,
                        handler: function() {
                            window.location.href = '../dhis-web-commons-about/redirect.action';
                        }
                    });

                    a.push(resizeButton);

                    return a;
                }()
            },

            // Add/resize map after layout
            afterLayout() {
                if (!this.map) {
                    this.map = gis.instance;
                    this.body.appendChild(this.map.getContainer());

                    L.Icon.Default.imagePath = 'images/';

                    // Needed to fix bug when toggling client cluster on google maps layer
                    this.map.options.maxZoom = 18;

                    // Add zoom control
                    this.map.addControl({
                        type: 'zoom',
                        position: 'topright'
                    });

                    // Add fit bounds control
                    this.map.addControl({
                        type: 'fitBounds',
                        position: 'topright'
                    });

                    // Add scale control
                    this.map.addControl({
                        type: 'scale',
                        imperial: false
                    });

                    // Add place search control (OSM Nominatim)
                    this.map.addControl({
                        type: 'search',
                    });

                    // Add measurement control
                    this.map.addControl({
                        type: 'measure',
                        position: 'topright',
                        primaryLengthUnit: 'kilometers',
                        secondaryLengthUnit: 'miles',
                        primaryAreaUnit: 'hectares',
                        secondaryAreaUnit: 'acres',
                        activeColor: '#ffa500',
                        completedColor: '#ffa500'
                    });

                    this.map.invalidateSize();
                    this.map.fitBounds([[-34.9, -18.7], [35.9, 50.2]]);
                } else {
                    this.map.invalidateSize();
                }
            }

        });

        eastRegion = Ext.create('Ext.panel.Panel', {
            region: 'east',
            layout: 'anchor',
            width: 200,
            preventHeader: true,
            collapsible: true,
            collapseMode: 'mini',
            items: function() {
                var a = [];

                layersPanel = GIS.app.LayersPanel(gis);

                a.push({
                    title: GIS.i18n.layer_stack_transparency,
                    bodyStyle: 'padding: 3px 2px 2px 5px; border:0 none; border-bottom: 1px solid #d0d0d0; border-top: 1px solid #d0d0d0',
                    style: 'border:0 none',
                    items: layersPanel,
                    collapsible: true,
                    animCollapse: false
                });

                a.push({
                    title: GIS.i18n.facility_layer_legend,
                    bodyStyle: 'padding: 5px 6px 3px; border: 0 none; border-bottom: 1px solid #d0d0d0; border-top: 1px solid #d0d0d0',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.facility.legendPanel = this;
                        }
                    }
                });

                a.push({
                    title: GIS.i18n.thematic_layer_1_legend,
                    bodyStyle: 'padding: 4px 6px 6px; border: 0 none; border-bottom: 1px solid #d0d0d0; border-top: 1px solid #d0d0d0',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.thematic1.legendPanel = this;
                        }
                    }
                });

                a.push({
                    title: GIS.i18n.thematic_layer_2_legend,
                    bodyStyle: 'padding: 4px 6px 6px; border: 0 none; border-bottom: 1px solid #d0d0d0; border-top: 1px solid #d0d0d0',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.thematic2.legendPanel = this;
                        }
                    }
                });

                a.push({
                    title: GIS.i18n.thematic_layer_3_legend,
                    bodyStyle: 'padding: 4px 6px 6px; border: 0 none; border-bottom: 1px solid #d0d0d0',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.thematic3.legendPanel = this;
                        }
                    }
                });

                a.push({
                    title: GIS.i18n.thematic_layer_4_legend,
                    bodyStyle: 'padding: 4px 6px 6px; border: 0 none',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.thematic4.legendPanel = this;
                        }
                    }
                });

                a.push({
                    title: GIS.i18n.earth_engine_layer_legend,
                    bodyStyle: 'padding: 4px 6px 6px; border: 0 none',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.earthEngine.legendPanel = this;
                        }
                    }
                });

                a.push({
                    title: GIS.i18n.external_layer_legend,
                    bodyStyle: 'padding: 4px 6px 6px; border: 0 none',
                    collapsible: true,
                    collapsed: true,
                    animCollapse: false,
                    listeners: {
                        added() {
                            gis.layer.external.legendPanel = this;
                        }
                    }
                });

                return a;
            }(),
            listeners: {
                collapse() {
                    resizeButton.setText('<<<');
                },
                expand() {
                    resizeButton.setText('>>>');
                }
            }
        });

        onRender = function(vp) {
            gis.mask = Ext.create('Ext.LoadMask', centerRegion, {
                msg: 'Loading'
            });
        };

        afterRender = function() {

            // Favorite
            var id = gis.util.url.getUrlParam('id'),
                session = gis.util.url.getUrlParam('s'),
                base = gis.util.url.getUrlParam('base'),
                layout;

            if (id) {
                gis.map = {
                    id: id
                };
                GIS.core.MapLoader(gis).load();
            }
            else if (isString(session) && GIS.isSessionStorage && isObject(JSON.parse(sessionStorage.getItem('dhis2'))) && session in JSON.parse(sessionStorage.getItem('dhis2'))) {
                layout = gis.api.layout.Layout(JSON.parse(sessionStorage.getItem('dhis2'))[session]);

                if (layout) {
                    GIS.core.MapLoader(gis, true).load([layout]);
                }
            }

            // TODO: Add missing base code
            /*
            if (base.length) {

                // hide base layer
                if (arrayContains(['false', 'none', 'no', 'off'], base)) {
                    for (var i = 0, item; i < layersPanel.layerItems.length; i++) {
                        item = layersPanel.layerItems[i];

                        if (item.layer.layerType === gis.conf.finals.layer.type_base && item.layer.visibility) {
                            item.disableItem();
                        }
                    }
                }
                else {
                    var isEnabled = false;

                    for (var i = 0, item; i < layersPanel.layerItems.length; i++) {
                        item = layersPanel.layerItems[i];

                        if (item.layer.layerType === gis.conf.finals.layer.type_base) {
                            if (base === item.layer.id) {
                                item.enableItem();
                                isEnabled = true;
                            }
                            else {
                                item.disableItem();
                            }
                        }
                    }

                    if (!isEnabled) {
                        layersPanel.layerItems[layersPanel.layerItems.length - 1].enableItem();
                    }
                }
            }*/

            // remove params from url
            if (id || session || base) {
                history.pushState(null, null, '.')
            }

            var initEl = document.getElementById('init');
            initEl.parentNode.removeChild(initEl);

            Ext.getBody().setStyle('background', '#fff');
            Ext.getBody().setStyle('opacity', 0);

            // fade in
            Ext.defer( function() {
                Ext.getBody().fadeIn({
                    duration: 600
                });
            }, 300 );
        };

        viewport = Ext.create('Ext.container.Viewport', {
            id: 'viewport',
            layout: 'border',
            eastRegion: eastRegion,
            centerRegion: centerRegion,
            downloadButton: downloadButton,
            shareButton: shareButton,
            aboutButton: aboutButton,
            layersPanel: layersPanel,
            items: [
                centerRegion,
                eastRegion
            ],
            listeners: {
                render() {
                    onRender(this);
                },
                afterrender() {
                    afterRender();
                }
            }
        });

        return viewport;
    };

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
                gis.viewport = createViewport();
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
                // init.analyticsPath = init.contextPath + '/api/25/'; // https://jira.dhis2.org/browse/DHIS2-502
                init.analyticsPath = init.apiPath;
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
                                    url: encodeURI(init.apiPath + 'me'),
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
                                            var dhis2PeriodUrl = init.contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.period.js',
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

                                                                            url += '&filter=id:in:[' + ids.join(',') + ']';

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
