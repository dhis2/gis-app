// Window container for layer widgets
GIS.app.WidgetWindow = function(gis, layer, width, padding) {
    width = width || gis.conf.layout.widget.window_width;
    padding = padding || 0;

    return Ext.create('Ext.window.Window', {
        title: layer.name,
        layout: 'fit',
        iconCls: 'gis-window-title-icon-' + layer.id,
        bodyStyle: 'padding:' + padding + 'px',
        cls: 'gis-container-default',
        closeAction: 'hide',
        width: width,
        resizable: false,
        isRendered: false,
        items: layer.widget,
        bbar: [
            '->',
            {
                text: GIS.i18n.update,
                handler: function() {
                    var view = layer.widget.getView();

                    if (view) {
                        var handler = layer.getHandler(gis, layer);
                        handler.compare = (layer.id !== gis.layer.facility.id);
                        handler.zoomToVisibleExtent = true;
                        handler.hideMask = true;
                        handler.load(view);
                    }
                }
            }
        ],
        listeners: {
            show: function(w) {
                if (!this.isRendered) {
                    this.isRendered = true;

                    /* TODO: Check mapfish/core/GeoStat/all.js
                       Set gui state from map view config (favorite)

                    if (layer.core.view) {
                        this.widget.setGui(layer.core.view);
                    }
                    */
                }

                gis.util.gui.window.setPositionTopLeft(this);
            }
        }
    });
};