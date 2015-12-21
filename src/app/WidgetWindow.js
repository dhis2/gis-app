GIS.app.WidgetWindow = function(gis, layer, width, padding) {
    width = width || gis.conf.layout.widget.window_width;
    padding = padding || 0;

    return Ext.create('Ext.window.Window', {
        //autoShow: true,
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
                        console.log("###", layer);
                        var loader = layer.core.getLoader();
                        loader.compare = (layer.id !== gis.layer.facility.id),
                            loader.zoomToVisibleExtent = true;
                        loader.hideMask = true;
                        loader.load(view);
                    }
                }
            }
        ],
        listeners: {
            show: function(w) {
                if (!this.isRendered) {
                    this.isRendered = true;

                    /* TODO: What is this doing?
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