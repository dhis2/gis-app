export default function LayerHandlerEarthEngine(gis, layer) {

    const datasets = {
        'USGS/SRTMGL1_003': {
            name: 'Elevation',
            unit: 'metres above sea level',
            description: '',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003" target="_blank">NASA / USGS / JPL-Caltech</a>',
        },
        'WorldPop/POP': {
            name: 'Population density',
            unit: 'people per km<sup>2</sup>',
            aggregation: 'mosaic',
            methods: {
                multiply: [100] // Convert from people/hectare to people/km2
            },
            description: 'Population in 100 x 100 m grid cells.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP" target="_blank">WorldPop</a>',
        },
        'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS': {
            name: 'Nighttime lights',
            unit: 'light intensity',
            band: 'stable_lights',
            description: 'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/NOAA%2FDMSP-OLS%2FNIGHTTIME_LIGHTS" target="_blank">NOAA</a>',
        },
        'UCSB-CHG/CHIRPS/PENTAD': {
            name: 'Precipitation',
            unit: 'millimeter',
            description: 'Description description',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD" target="_blank">UCSB/CHG</a>',
        },
        'MODIS/MOD11A2': {
            name: 'Temperature',
            unit: '°C during daytime',
            band: 'LST_Day_1km',
            methods: {
                toFloat: [],
                multiply: [0.02],
                subtract: [273.15],
            },
            description: 'Temperature description',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/MODIS%2FMOD11A2" target="_blank">NASA LP DAAC</a>',
        },
    };

    const createLayer = function(view) {
        const layerConfig = {};

        if (typeof view.config === 'string') { // From database as favorite
            view.config = JSON.parse(view.config);
        }

        Object.assign(layerConfig, {
            type: 'earthEngine',
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
        }, layer.config, datasets[view.config.id], view.config);

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
    const hideMask = function() {
        if (gis.mask && loader.hideMask) {
            gis.mask.hide();
        }
    };

    const addLegend = function() {
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
};
