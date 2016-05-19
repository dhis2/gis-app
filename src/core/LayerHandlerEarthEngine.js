export default function LayerHandlerEarthEngine(gis, layer) {
    var createLayer,
        afterLoad,
        loader;

    createLayer = function(view) {
        /*
        var layerConfig = Ext.apply({
            accessToken: function(callback) {
                Ext.Ajax.request({
                    url: gis.init.contextPath + '/api/tokens/google',
                    disableCaching: false,
                    failure: function(r) {
                        gis.alert(r);
                    },
                    success: function(r) {
                        callback(JSON.parse(r.responseText));
                    }
                });
            }
        }, layer.config, view);
        */

        // console.log( layer.config, view);

        var layerConfig = {
            id: "srtm90_v4",
            name: "Elevation",
            type: 'earthEngine',
            pane: 'earthEngine',
            config: {
                min: 0,
                max: 2000,
                palette: "6EDC6E, F0FAA0, E6DCAA, DCDCDC, FAFAFA"
            },
            accessToken: function(callback) {
                Ext.Ajax.request({
                    url: gis.init.contextPath + '/api/tokens/google',
                    disableCaching: false,
                    failure: function(r) {
                        gis.alert(r);
                    },
                    success: function(r) {
                        callback(JSON.parse(r.responseText));
                    }
                });
            }
        };


        // console.log('layerconfig', layer.config, view, layerConfig);

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        // console.log(view);
        // layer.view = view;

        // afterLoad(view);

        gis.mask.hide();
    };

    afterLoad = function(view) {

        // Layer
        if (layer.item) { // Layer stack
            layer.item.setValue(true, view.opacity);
        }
        else {
            layer.instance.setOpacity(view.opacity);
        }

        // Gui
        if (loader.updateGui && isObject(layer.widget)) {
            layer.widget.setGui(view);
        }

        // Mask
        if (loader.hideMask) {
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
    };

    loader = {
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
};