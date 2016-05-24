export default function LayerHandlerEarthEngine(gis, layer) {
    var datasets,
        createLayer,
        hideMask,
        afterLoad,
        addLegend,
        loader;

    datasets = {
        elevation_srtm_30m: {
            name: 'Elevation',
            id: 'USGS/SRTMGL1_003',
            config: {
                min: 0,
                max: 5000,
                palette: '#538852,#8bc08b,#faf7c7,#e7de8b,#d5ce86,#facbb7,#dbac97,#d8baca,#f4e0e6,#eeeeee,#ffffff'
            },
            unit: 'm',
            description: 'Metres above sea level.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003">NASA / USGS / JPL-Caltech</a>'
        },
        worldpop_2010_un: {
            name: 'Population density 2010',
            id: 'WorldPop/POP',
            filter: [{
                type: 'eq',
                arguments: ['year', 2010]
            },{
                type: 'eq',
                arguments: ['UNadj', 'yes']
            }],
            config: {
                min: 0,
                max: 100,
                palette: '#fffff0,#ffffd4,#fee391,#fec44f,#fe9929,#ec7014,#cc4c02,#b44200,#9a3800,#7f2f00,#642500'
            },
            description: 'Population in 100 x 100 m grid cells.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP">WorldPop</a>'
        }
    };

    createLayer = function(view) {
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
        }, layer.config, datasets[view.code]);

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            layer.instance.off('initialized', hideMask);
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);
        layer.instance.on('initialized', hideMask);

        addLegend();
        afterLoad(view);
    };

    // Hide mask when layer is initialized
    hideMask = function() {
        if (gis.mask && loader.hideMask) {
            gis.mask.hide();
        }
    };

    addLegend = function() {
        var legend = layer.instance.getLegend();

        if (layer.legendPanel) {
            layer.legendPanel.update(legend);
        } else { // Dashboard map
            if (!gis.legend) {
                gis.legend = gis.instance.addControl({
                    type: 'legend',
                    offset: [0, -64],
                    content: html
                });
            } else {
                gis.legend.setContent(gis.legend.getContent() + legend);
            }
        }
    };

    afterLoad = function(view) {

        layer.view = view;

        // Legend
        if (gis.viewport) {
            gis.viewport.eastRegion.doLayout();
        }

        if (layer.legendPanel) {
            layer.legendPanel.expand();
        }

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