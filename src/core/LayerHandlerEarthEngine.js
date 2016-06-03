export default function LayerHandlerEarthEngine(gis, layer) {
    var datasets,
        createLayer,
        hideMask,
        afterLoad,
        addLegend,
        loader;

    datasets = {
        elevation_srtm_30m: {
            type: 'elevation',
            name: 'Elevation',
            id: 'USGS/SRTMGL1_003',
            /*
            config: {
                min: 0,
                max: 5000,
                palette: '#538852,#8bc08b,#faf7c7,#e7de8b,#d5ce86,#facbb7,#dbac97,#d8baca,#f4e0e6,#eeeeee,#ffffff'
            },
            */
            config: {
                min: 0,
                max: 1000,
                // palette: '#a50026,#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850,#006837', // Red - yellow - green
                // palette: '#543005,#8c510a,#bf812d,#dfc27d,#f6e8c3,#f5f5f5,#c7eae5,#80cdc1,#35978f,#01665e,#003c30',
                //palette: '#67001f,#b2182b,#d6604d,#f4a582,#fddbc7,#f7f7f7,#d1e5f0,#92c5de,#4393c3,#2166ac,#053061'
                palette: '#9e0142,#d53e4f,#f46d43,#fdae61,#fee08b,#ffffbf,#e6f598,#abdda4,#66c2a5,#3288bd,#5e4fa2'
            },
            // elevation: 500,
            unit: 'm',
            description: 'Metres above sea level.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003">NASA / USGS / JPL-Caltech</a>'
        },
        worldpop_2010_un: {
            type: 'population',
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
        }, layer.config, datasets[view.key], view);

        layerConfig.config.min = view.min;
        layerConfig.config.max = view.max;
        layerConfig.config.palette = view.palette;


        // TODO
        /*
        if (view.elevation) {
            layerConfig.elevation = view.elevation;
            layerConfig.config.min = 0;
            layerConfig.config.max = view.elevation + view.elevation;
        }
        */

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            layer.instance.off('initialized', hideMask);
            gis.instance.removeLayer(layer.instance);
        }

        //console.log('####', layerConfig, view);

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
                    content: legend
                });
            } else {
                gis.legend.setContent(gis.legend.getContent() + legend);
            }
        }
    };

    afterLoad = function(view) {

        layer.view = {
            key: view.key
        };

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
        if (loader.updateGui && layer.widget) {
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