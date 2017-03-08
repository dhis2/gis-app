import isFunction from 'd2-utilizr/lib/isFunction';

// Window container for layer widgets
export default function WidgetWindow(gis, layer, width, padding) {
    width = width || gis.conf.layout.widget.window_width;
    padding = padding || 0;

    let layerConfig;
    let callback;

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
                handler: () => {
                    var view = layer.widget.getView();

                    // console.log('### this', layerConfig, callback);

                    //console.log('this', layer.widget.onUpdate, this.onUpdate, this);

                    if (view && layerConfig && callback) {
                        /*
                        var handler = layer.handler(gis, layer);

                        handler.compare = (layer.id !== gis.layer.facility.id && layer.id !== gis.layer.earthEngine.id);
                        handler.zoomToVisibleExtent = true;
                        handler.hideMask = true;
                        handler.load(view);
                        */

                        callback({
                            ...layerConfig,
                            ...view,
                            edit: false,
                            loaded: false,
                        });

                        // Post usage statistics each time update button is clicked
                        // TODO: Move to a shared layer handler prototye
                        gis.postDataStatistics();
                    }
                }
            }
        ],
        listeners: {
            show(widget) {
                callback = widget.onUpdate; // Temporary hack
                layerConfig = widget.layer; // Temporary hack

                if (!this.isRendered) {
                    this.isRendered = true;

                    /*
                    if (layer.view) {
                        this.widget.setGui(layer.view); // TODO
                    }
                    */
                }

                // gis.util.gui.window.setPositionTopLeft(this);
            }
        }
    });
};