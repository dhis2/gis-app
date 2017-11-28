export default function LayerHandlerEarthEngine(gis, layer) {

    const datasets = {
        'USGS/SRTMGL1_003': {
            name: 'Elevation',
            unit: 'metres',
            band: 'elevation',
            mask: true,
            description: 'Elevation above sea-level.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003" target="_blank">NASA / USGS / JPL-Caltech</a>',
        },
        'WorldPop/POP': {
            name: 'Population density',
            unit: 'people per km<sup>2</sup>',
            aggregation: 'mosaic',
            mask: true,
            methods: {
                multiply: [100] // Convert from people/hectare to people/km2
            },
            resolution: 100,
            projection: 'EPSG:4326',
            value(value) {
                return Math.round(value);
            },
            description: 'Population density estimates with national totals adjusted to match UN population division estimates.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP" target="_blank">WorldPop</a>'
        },
        'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS': {
            name: 'Nighttime lights',
            unit: 'light intensity',
            band: 'stable_lights',
            mask: true,
            popup: '{name}: {value}',
            description: 'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/NOAA%2FDMSP-OLS%2FNIGHTTIME_LIGHTS" target="_blank">NOAA</a>'
        },
        'UCSB-CHG/CHIRPS/PENTAD': {
            name: 'Precipitation',
            unit: 'millimeter',
            band: 'precipitation',
            mask: true,
            value(value) {
                return value.toFixed(1);
            },
            description: 'Precipitation collected from satellite and weather stations on the ground.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD" target="_blank">UCSB/CHG</a>'
        },
        'MODIS/MOD11A2': {
            name: 'Temperature',
            unit: '°C during daytime',
            band: 'LST_Day_1km',
            mask: true,
            methods: {
                toFloat: [],
                multiply: [0.02],
                subtract: [273.15],
            },
            value(value) {
                return Math.round(value);
            },
            popup: '{name}: {value}{unit}',
            description: 'Land surface temperatures collected from satellite. Blank spots will appear in areas with a persistent cloud cover.',
            attribution: '<a href="https://explorer.earthengine.google.com/#detail/MODIS%2FMOD11A2" target="_blank">NASA LP DAAC</a>'
        },
        'MODIS/051/MCD12Q1': {
            name: 'Landcover',
            unit: '',
            band: 'Land_Cover_Type_1',
            params: {
                min: 0,
                max: 17,
                palette: 'aec3d6,162103,235123,399b38,38eb38,39723b,6a2424,c3a55f,b76124,d99125,92af1f,10104c,cdb400,cc0202,332808,d7cdcc,f7e174,743411',
            },
            mask: false,
            legend: [{
                color: '#aec3d6',
                name: 'Water'
            },{
                color: '#162103',
                name: 'Evergreen Needleleaf forest'
            },{
                color: '#235123',
                name: 'Evergreen Broadleaf forest'
            },{
                color: '#399b38',
                name: 'Deciduous Needleleaf forest'
            },{
                color: '#38eb38',
                name: 'Deciduous Broadleaf forest'
            },{
                color: '#39723b',
                name: 'Mixed forest'
            },{
                color: '#6a2424',
                name: 'Closed shrublands'
            },{
                color: '#c3a55f',
                name: 'Open shrublands'
            },{
                color: '#b76124',
                name: 'Woody savannas'
            },{
                color: '#d99125',
                name: 'Savannas'
            },{
                color: '#92af1f',
                name: 'Grasslands'
            },{
                color: '#10104c',
                name: 'Permanent wetlands'
            },{
                color: '#cdb400',
                name: 'Croplands'
            },{
                color: '#cc0202',
                name: 'Urban and built-up'
            },{
                color: '#332808',
                name: 'Cropland/Natural vegetation mosaic'
            },{
                color: '#d7cdcc',
                name: 'Snow and ice'
            },{
                color: '#f7e174',
                name: 'Barren or sparsely vegetated'
            },{
                color: '#743411',
                name: 'Unclassified'
            }],
            popup: '{name}: {value}',
            description: 'Distinct landcover types collected from satellites.',
            attribution: '<a href="https://code.earthengine.google.com/dataset/MODIS/051/MCD12Q1" target="_blank">NASA LP DAAC</a>'
        },
    };

    const createLayer = function(view) {
        const layerConfig = {};

        if (typeof view.config === 'string') { // From database as favorite
            view.config = JSON.parse(view.config);
        }

        if (view.config.id) {
            Object.assign(layerConfig, {
                type: 'earthEngine',
                accessToken: function (callback) {
                    Ext.Ajax.request({
                        url: gis.init.apiPath + 'tokens/google',
                        disableCaching: false,
                        failure: function (r) {
                            gis.alert(r);
                        },
                        success: function (r) {
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
        }
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
