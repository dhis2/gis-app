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

});