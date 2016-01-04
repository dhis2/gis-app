GIS.app.LayersPanel = function(gis) {
    var layers = gis.layer,
        layer,
        items = [],
        item,
        panel,
        orderedLayers = [
            layers.event,
            layers.facility,
            layers.thematic1,
            layers.thematic2,
            layers.thematic3,
            layers.thematic4,
            layers.boundary,
            layers.googleStreets,
            layers.googleHybrid,
            layers.openStreetMap
        ],
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

    panel = Ext.create('Ext.panel.Panel', {
        layout: 'fit',
        cls: 'gis-container-inner',
        layerItems: items,
        items: {
            cls: 'gis-container-inner',
            items: items
        }
    });

    return panel;
};
