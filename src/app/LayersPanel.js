GIS.app.LayersPanel = function() {
    var layers = gis.layer,
        layer,
        items = [],
        item,
        panel,
        visibleLayer = function() {
            return window.google ? layers.googleStreets : layers.openStreetMap;
        }(),
        orderedLayers = gis.olmap.layers.reverse(),
        layerIsVisibleLayer;

    // gm first
    for (var i = 0; i < 2; i++) {
        if (Ext.Array.contains(['googleStreets', 'googleHybrid'], orderedLayers[0].id)) {
            orderedLayers.push(orderedLayers.shift());
        }
    }

    for (var i = 0, layerIsVisibleLayer; i < orderedLayers.length; i++) {
        layer = orderedLayers[i];
        layerIsVisibleLayer = Ext.isObject(visibleLayer) && layer.id === visibleLayer.id;

        item = Ext.create('Ext.ux.panel.LayerItemPanel', {
            cls: 'gis-container-inner',
            height: 23,
            layer: layer,
            text: layer.name,
            imageUrl: 'images/' + layer.id + '_14.png',
            value: layerIsVisibleLayer && window.google ? true : false,
            opacity: layer.layerOpacity,
            defaultOpacity: layer.layerOpacity,
            numberFieldDisabled: !layerIsVisibleLayer
        });

        layer.item = item;
        items.push(layer.item);
    }

    if (visibleLayer) {
        visibleLayer.item.setValue(!!window.google);
    }

    panel = Ext.create('Ext.panel.Panel', {
        renderTo: 'layerItems',
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
