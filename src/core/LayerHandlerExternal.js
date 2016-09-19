// Layer handler for external layers (WMS/TMS/XYZ)
export default function LayerHandlerExternal(gis, layer) {

    // Create new layer for view definition
    const createLayer = function(view) {
        if (typeof view.config === 'string') { // From database as favorite
            view.config = JSON.parse(view.config);
        }

        const config = view.config;

        const layerConfig = {
            type: 'tileLayer',
            url: config.url,
            attribution: config.attribution,
            pane: 'external_' + config.placement
        };

        if (config.service === 'tms') {
            layerConfig.tms = true;
        }

        if (config.service === 'wms') {
            layerConfig.type = 'wmsLayer';
            layerConfig.layers = config.layers;
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
        layer.view = { // simplify view for storage
            config: JSON.stringify(view.config)
        };

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

        // Gui
        if (loader.updateGui && layer.widget) {
            layer.widget.setGui(view);
        }

        if (gis.mask && loader.hideMask) {
            gis.mask.hide();
        }

        // Map callback
        if (loader.callBack) {
            loader.callBack(layer);
        }
        else {
            gis.map = null;

            if (gis.viewport.shareButton) {
                gis.viewport.shareButton.enable();
            }
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