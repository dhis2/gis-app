// Layer handler for external layers (WMS/TMS/XYZ)
export default function LayerHandlerExternal(gis, layer) {

    // Create new layer for view definition
    const createLayer = function(view) {
        const layerConfig = {
            type: 'tileLayer',
            url: view.url,
            attribution: view.attribution,
            pane: 'external_' + view.placement
        };

        if (view.service === 'tms') {
            layerConfig.tms = true;
        }

        if (view.service === 'wms') {
            layerConfig.type = 'wmsLayer';
            layerConfig.layers = view.layers;
        }

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        afterLoad(view);
    }

    const afterLoad = function(view) {
        // Legend
        if (gis.viewport) {
            gis.viewport.eastRegion.doLayout();
        }

        if (layer.legendPanel) {
            layer.legendPanel.expand();
        }

        if (layer.item) { // Layer stack
            layer.item.setValue(true, view.opacity);
        }
        else {
            layer.instance.setOpacity(view.opacity);
        }

        if (gis.mask && loader.hideMask) {
            gis.mask.hide();
        }
    }

    const loader = {
        compare: false,
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        load: function(view) {
            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            createLayer(view);
        }
    };

    return loader;
}