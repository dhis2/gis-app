import LayerWidgetEvent from './LayerWidgetEvent';
import LayerWidgetFacility from './LayerWidgetFacility';
import LayerWidgetThematic from './LayerWidgetThematic';
import LayerWidgetBoundary from './LayerWidgetBoundary';
import LayerWidgetEarthEngine from './LayerWidgetEarthEngine';
import LayerWidgetExternal from './LayerWidgetExternal';

const layerType = {
    event: LayerWidgetEvent,
    facility: LayerWidgetFacility,
    thematic: LayerWidgetThematic,
    boundary: LayerWidgetBoundary,
    earthEngine: LayerWidgetEarthEngine,
    external: LayerWidgetExternal,
};

// Window container for layer widgets
export default function WidgetWindow(gis, layer, onUpdate) {
    const type = layer.layerType;
    const layerWidget = layerType[type](gis, layer);

    return Ext.create('Ext.window.Window', {
        title: layer.name,
        layout: 'fit',
        iconCls: 'gis-window-title-icon-' + layer.id,
        bodyStyle: 'padding:0',
        cls: 'gis-container-default',
        closeAction: 'hide',
        width: type === 'event' ? 456 : 306,
        resizable: false,
        isRendered: false,
        items: layerWidget,
        bbar: [
            '->',
            {
                text: GIS.i18n.update,
                handler: () => {
                    const view = layerWidget.getView();

                    onUpdate({
                        ...layer,
                        ...view,
                    });

                    // Post usage statistics each time update button is clicked
                    // TODO: Move to a shared layer handler
                    gis.postDataStatistics();
                }
            }
        ],
        setLayer: (layer) => {
            layerWidget.setGui(layer);
        }

    });
};