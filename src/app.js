Ext.onReady( function() {
    var createViewport,
        initialize,
        gis;

    // set app config
    (function() {

        // ext configuration
        Ext.QuickTips.init();

        Ext.override(Ext.LoadMask, {
            onHide: function() {
                this.callParent();
            }
        });

        Ext.override(Ext.grid.Scroller, {
            afterRender: function() {
                var me = this;
                me.callParent();
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
            onElScroll: function(event, target) {
                this.wasScrolled = true; // change flag -> show that listener is alive
                this.fireEvent('bodyscroll', event, target);
            },

            // executes just after main scroll event listener and check flag state
            onElScrollCheck: function(event, target, options) {
                var me = this;

                if (!me.wasScrolled) {
                    // Achtung! Event listener was disappeared, so we'll add it again
                    me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
                }
                me.wasScrolled = false; // change flag to initial value
            }

        });

        Ext.override(Ext.data.TreeStore, {
            load: function(options) {
                options = options || {};
                options.params = options.params || {};

                var me = this,
                    node = options.node || me.tree.getRootNode(),
                    root;

                // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
                // create one for them.
                if (!node) {
                    node = me.setRootNode({
                        expanded: true
                    });
                }

                if (me.clearOnLoad) {
                    node.removeAll(true);
                }

                options.records = [node];

                Ext.applyIf(options, {
                    node: node
                });
                //options.params[me.nodeParam] = node ? node.getId() : 'root';

                if (node) {
                    node.set('loading', true);
                }

                return me.callParent([options]);
            }
        });

        // right click handler
        document.body.oncontextmenu = function() {
            return false;
        };

    }());


    GIS.app = {};

    GIS.app.extendInstance = function(gis) {
        var conf = gis.conf,
            util = gis.util,
            init = gis.init,
            store = gis.store,
            layer;

        // TODO: Add code
    };

    var createViewport = function() {
        var centerRegion,
            eastRegion,
            downloadButton,
            shareButton,
            aboutButton,
            defaultButton,
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
            handler: function(b) {
                console.log("defaultButton Handler disabled");
                /*
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
                */
            }
        });

        interpretationItem = Ext.create('Ext.menu.Item', {
            text: 'Write interpretation' + '&nbsp;&nbsp;',
            iconCls: 'gis-menu-item-tablelayout',
            disabled: true,
            xable: function() {
                if (gis.map) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            },
            handler: function() {
                if (viewport.interpretationWindow) {
                    viewport.interpretationWindow.destroy();
                    viewport.interpretationWindow = null;
                }

                viewport.interpretationWindow = GIS.app.InterpretationWindow();
                viewport.interpretationWindow.show();
            }
        });

        pluginItem = Ext.create('Ext.menu.Item', {
            text: 'Embed in web page' + '&nbsp;&nbsp;',
            iconCls: 'gis-menu-item-datasource',
            disabled: true,
            xable: function() {
                // TODO: Add code
            },
            handler: function() {
                // TODO: Add code
            }
        });

        // TODO: Add missing code

        var centerRegion = Ext.create('Ext.panel.Panel', {
            region: 'center',
            //map: gis.olmap,
            fullSize: true,
            cmp: [defaultButton],
            trash: [],
            toggleCmp: function(show) {
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
                items: function() {
                    var a = [];
                    a.push({
                        //iconCls: 'gis-btn-icon-' + gis.layer.event.id,
                        //menu: gis.layer.event.menu,
                        tooltip: GIS.i18n.event_layer,
                        width: 26
                    });

                    console.log("gis.layer", gis.layer);

                    return a;
                }()
            }
        });

        var eastRegion = Ext.create('Ext.panel.Panel', {
            region: 'east',
            layout: 'anchor',
            width: 200,
            preventHeader: true,
            collapsible: true,
            collapseMode: 'mini'
        });


        var onRender = function(vp) {
            // gis.olmap.mask = Ext.create('Ext.LoadMask', centerRegion, {
            gis.mask = Ext.create('Ext.LoadMask', centerRegion, { // TODO
                msg: 'Loading'
            });
        };

        var afterRender = function() {

            // TODO: Add code


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

        var viewport = Ext.create('Ext.container.Viewport', {
            id: 'viewport',
            layout: 'border',
            //eastRegion: eastRegion,
            //centerRegion: centerRegion,
            //downloadButton: downloadButton,
            //shareButton: shareButton,
            //aboutButton: aboutButton,
            //layersPanel: layersPanel,
            items: [
                centerRegion,
                eastRegion
            ],
            listeners: {
                render: function() {
                    onRender(this);
                },
                afterrender: function() {
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
            // if (++callbacks === requests.length) {
            if (callbacks === requests.length) { // TODO: Added by Bjorn to bypass

                // viewport
                gis = {}; // TODO: Added by Bjorn for testing
                gis.viewport = createViewport();

            }
        };

        fn(); // TODO: Added by Bjorn for testing


        // requests

        Ext.Ajax.request({
            url: 'manifest.webapp',
            success: function(r) {
                init.contextPath = Ext.decode(r.responseText).activities.dhis.href;

                // TODO: Add missing code

                var defaultKeyUiLocale = 'en';
                var keyUiLocale = 'en'; // TODO: Get from user account

                requests.push({
                    url: 'i18n/i18n_app.properties',
                    success: function(r) {
                        GIS.i18n = dhis2.util.parseJavaProperties(r.responseText);

                        if (keyUiLocale === defaultKeyUiLocale) {
                            fn();
                        }
                        else {
                            Ext.Ajax.request({
                                url: 'i18n/i18n_app_' + keyUiLocale + '.properties',
                                success: function(r) {
                                    Ext.apply(GIS.i18n, dhis2.util.parseJavaProperties(r.responseText));
                                },
                                failure: function() {
                                    console.log('No translations found for system locale (' + keyUiLocale + ')');
                                },
                                callback: function() {
                                    fn();
                                }
                            });
                        }
                    },
                    failure: function() {
                        Ext.Ajax.request({
                            url: 'i18n/i18n_app_' + keyUiLocale + '.properties',
                            success: function(r) {
                                GIS.i18n = dhis2.util.parseJavaProperties(r.responseText);
                            },
                            failure: function() {
                                alert('No translations found for system locale (' + keyUiLocale + ') or default locale (' + defaultKeyUiLocale + ').');
                            },
                            callback: fn
                        });
                    }
                });

                for (var i = 0; i < requests.length; i++) {
                    Ext.Ajax.request(requests[i]);
                }

            }
        });


    }());


});