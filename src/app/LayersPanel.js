export default function LayersPanel(gis) {
    var layers = gis.layer,
        orderedLayers = [
            layers.event,
            layers.facility,
            layers.boundary,
            layers.thematic1,
            layers.thematic2,
            layers.thematic3,
            layers.thematic4,
            layers.earthEngine,
            layers.openStreetMap,
            layers.osmLight,
            layers.googleStreets,
            layers.googleHybrid
        ],
        layer,
        item,
        items = [],
        visibleLayer = layers.openStreetMap;

    for (var i = 0, layerIsVisibleLayer; i < orderedLayers.length; i++) {
        layer = orderedLayers[i];
        layerIsVisibleLayer = layer.id === visibleLayer.id;

        item = Ext.create('Ext.ux.panel.LayerItemPanel', {
            cls: 'gis-container-inner',
            height: 23,
            layer: layer,
            text: layer.name,
            imageUrl: 'images/' + layer.id + '_14.png',
            value: layerIsVisibleLayer,
            opacity: layer.layerOpacity,
            defaultOpacity: layer.layerOpacity,
            numberFieldDisabled: !layerIsVisibleLayer
        });

        layer.item = item;
        items.push(layer.item);
    }

    visibleLayer.item.setValue(true);

    return Ext.create('Ext.panel.Panel', {
        layout: 'fit',
        cls: 'gis-container-inner',
        layerItems: items,
        items: {
            cls: 'gis-container-inner',
            items: items
        }
    });

};
