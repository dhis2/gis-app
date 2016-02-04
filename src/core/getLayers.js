GIS.core.getLayers = function(gis) {
    var layerNumbers = ['1', '2', '3', '4'];

    var layers = {
        openStreetMap: {
            id: 'openStreetMap',
            name: GIS.i18n.openstreetmap,
            layerType: 'base',
            layerOpacity: 1,
            config: {
                type: 'mapQuest',
            }
        },
        googleStreets: {
            id: 'googleStreets',
            name: GIS.i18n.google_streets,
            layerType: 'base',
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
            layerType: 'base',
            config: {
                type: 'googleLayer',
                style: 'HYBRID'
            }
        },
        event: {
            id: 'event',
            name: GIS.i18n.event_layer,
            layerOpacity: 0.8,
            zIndex: 160,
            config: {
                type: 'points'
            },
            handler: GIS.core.LayerHandlerEvent
        },
        facility: {
            id: 'facility',
            name: GIS.i18n.facility_layer,
            layerOpacity: 1,
            zIndex: 150,
            config: {
                type: 'markers'
            },
            handler: GIS.core.LayerHandlerFacility,
            featureStore: Ext.create('Ext.data.Store', {
                fields: ['id', 'name'],
                features: [],
                loadFeatures: function(features) {
                    if (features && features.length) {
                        var data = [];
                        for (var i = 0; i < features.length; i++) {
                            data.push([features[i].id, features[i].properties.name]);
                        }
                        this.loadData(data);
                        this.sortStore();

                        this.features = features;
                    }
                    else {
                        this.removeAll();
                    }
                },
                sortStore: function() {
                    this.sort('name', 'ASC');
                }
            })
        },
        boundary: {
            id: 'boundary',
            name: GIS.i18n.boundary_layer,
            layerOpacity: 1,
            zIndex: 100,
            config: {
                type: 'boundary'
            },
            handler: GIS.core.LayerHandlerBoundary,
            featureStore: Ext.create('Ext.data.Store', {
                fields: ['id', 'name'],
                features: [],
                loadFeatures: function(features) {
                    if (features && features.length) {
                        var data = [];
                        for (var i = 0; i < features.length; i++) {
                            data.push([features[i].id, features[i].properties.name]);
                        }
                        this.loadData(data);
                        this.sortStore();

                        this.features = features;
                    }
                    else {
                        this.removeAll();
                    }
                },
                sortStore: function() {
                    this.sort('name', 'ASC');
                }
            })
        }
    };

    for (var i = 0, number; i < layerNumbers.length; i++) {
        number = layerNumbers[i];

        layers['thematic' + number] = {
            id: 'thematic' + number,
            name: GIS.i18n.thematic_layer + ' ' + number,
            layerOpacity: 0.8,
            zIndex: 110 + (i * 10),
            config: {
                type: 'choropleth'
            },
            handler: GIS.core.LayerHandlerThematic
        };
    }

    return layers;
};