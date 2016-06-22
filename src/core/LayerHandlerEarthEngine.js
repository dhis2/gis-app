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
            unit: 'm',
            description: 'Metres above sea level.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003" target="_blank">NASA / USGS / JPL-Caltech</a>'
        },
        worldpop_2015_un: {
            type: 'population',
            name: 'Population density 2015',
            id: 'WorldPop/POP',
            filter: [{
                type: 'eq',
                arguments: ['year', 2015]
            },{
                type: 'eq',
                arguments: ['UNadj', 'yes']
            }],
            description: 'Population in 100 x 100 m grid cells.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP" target="_blank">WorldPop</a>'
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
            description: 'Population in 100 x 100 m grid cells.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP" target="_blank">WorldPop</a>'
        },
        nightlights_2013: {
            type: 'nightLights',
            name: 'Nighttime lights 2013',
            id: 'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS',
            filterDate: ['2013-01-01', '2014-01-31'],
            description: 'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/NOAA%2FDMSP-OLS%2FNIGHTTIME_LIGHTS" target="_blank">NOAA</a>'
        }
    };

    createLayer = function(view) {
        const layerConfig = {};

        if (typeof view.config === 'string') { // From database as favorite
            view.config = JSON.parse(view.config);
        }

        Object.assign(layerConfig, {
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
        }, layer.config, datasets[view.config.key], view.config);

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
                    content: legend
                });
            } else {
                gis.legend.setContent(gis.legend.getContent() + legend);
            }
        }
    };

    afterLoad = function(view) {

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
