GIS.core.getLayers = function(gis) {
    var layerNumbers = ['1', '2', '3', '4'];

    var layers = {
        openStreetMap: {
            id: 'openStreetMap',
            name: GIS.i18n.openstreetmap,
            layerType: gis.conf.finals.layer.type_base,
            layerOpacity: 1,
            config: {
                type: 'mapQuest',
            }
        },
        googleStreets: {
            id: 'googleStreets',
            name: GIS.i18n.google_streets,
            layerType: gis.conf.finals.layer.type_base,
            layerOpacity: 1,
            config: {
                type: 'googleLayer',
                style: 'ROADMAP'
            }
        },
        googleHybrid: {
            id: 'googleHybrid',
            name: GIS.i18n.google_hybrid,
            layerOpacity: 1,
            layerType: gis.conf.finals.layer.type_base,
            config: {
                type: 'googleLayer',
                style: 'HYBRID'
            }
        },
        event: {
            id: 'event',
            name: GIS.i18n.event_layer,
            layerOpacity: 0.8,
            config: {
                type: 'points'
            },
            getLoader: GIS.core.LayerLoaderEvent
        },
        facility: {
            id: 'facility',
            name: GIS.i18n.facility_layer,
            layerOpacity: 1,
            config: {
                type: 'markers'
            },
            getLoader: GIS.core.LayerLoaderFacility
        },
        boundary: {
            id: 'boundary',
            name: GIS.i18n.boundary_layer,
            layerOpacity: 1,
            config: {
                type: 'features'
            },
            getLoader: GIS.core.LayerLoaderBoundary
        }
    };

    for (var i = 0, number; i < layerNumbers.length; i++) {
        number = layerNumbers[i];

        layers['thematic' + number] = {
            id: 'thematic' + number,
            name: GIS.i18n.thematic_layer + ' ' + number,
            layerOpacity: 0.8,
            config: {
                type: 'choropleth'
            },
            getLoader: GIS.core.LayerLoaderThematic
        };
    }

    return layers;
};