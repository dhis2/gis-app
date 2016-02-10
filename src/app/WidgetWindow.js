// Window container for layer widgets
//GIS.app.WidgetWindow = function(gis, layer, width, padding) {
export default function WidgetWindow(gis, layer, width, padding) {
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
                        var handler = layer.handler(gis, layer);
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

                    if (layer.view) {
                        this.widget.setGui(layer.view);
                    }
                }

                gis.util.gui.window.setPositionTopLeft(this);
            }
        }
    });
};