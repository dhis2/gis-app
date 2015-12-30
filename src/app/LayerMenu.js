// Top layer dropdown menu
GIS.app.LayerMenu = function(gis, layer, cls) {
    var items = [],
        item;

    item = {
        text: GIS.i18n.edit_layer,
        iconCls: 'gis-menu-item-icon-edit',
        cls: 'gis-menu-item-first',
        alwaysEnabled: true,
        handler: function() {
            layer.window.show();
        }
    };
    items.push(item);

    items.push({
        xtype: 'menuseparator',
        alwaysEnabled: true
    });

    if (!(layer.id === gis.layer.boundary.id || layer.id === gis.layer.facility.id || layer.id === gis.layer.event.id)) {
        item = {
            text: GIS.i18n.filter + '..',
            iconCls: 'gis-menu-item-icon-filter',
            handler: function() {
                if (layer.filterWindow) {
                    if (layer.filterWindow.isVisible()) {
                        return;
                    }
                    else {
                        layer.filterWindow.destroy();
                    }
                }

                layer.filterWindow = layer.id === gis.layer.facility.id ?
                    GIS.app.FilterWindowFacility(layer) : GIS.app.FilterWindow(layer);
                layer.filterWindow.show();
            }
        };
        items.push(item);
    }

    if (!(layer.id === gis.layer.event.id)) {
        item = {
            text: GIS.i18n.search,
            iconCls: 'gis-menu-item-icon-search',
            handler: function() {
                if (layer.searchWindow) {
                    if (layer.searchWindow.isVisible()) {
                        return;
                    }
                    else {
                        layer.searchWindow.destroy();
                    }
                }

                layer.searchWindow = GIS.app.SearchWindow(layer);
                layer.searchWindow.show();
            }
        };
        items.push(item);
    }

    if (items[items.length - 1].xtype !== 'menuseparator') {
        items.push({
            xtype: 'menuseparator',
            alwaysEnabled: true
        });
    }


    item = {
        text: GIS.i18n.clear,
        iconCls: 'gis-menu-item-icon-clear',
        handler: function() {
            gis.instance.removeLayer(layer.instance);
            layer.widget.reset();
        }
    };
    items.push(item);

    return Ext.create('Ext.menu.Menu', {
        shadow: false,
        showSeparator: false,
        enableItems: function() {
            Ext.each(this.items.items, function(item) {
                item.enable();
            });
        },
        disableItems: function() {
            Ext.Array.each(this.items.items, function(item) {
                if (!item.alwaysEnabled) {
                    item.disable();
                }
            });
        },
        items: items,
        listeners: {
            afterrender: function() {
                this.getEl().addCls('gis-toolbar-btn-menu');
                if (cls) {
                    this.getEl().addCls(cls);
                }
            },
            show: function() {
                if (layer.instance) {
                    this.enableItems();
                }
                else {
                    this.disableItems();
                }

                this.doLayout(); // show menu bug workaround
            }
        }
    });
};