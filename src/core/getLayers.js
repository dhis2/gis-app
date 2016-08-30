export default function getLayers(gis) {
    var layerNumbers = ['1', '2', '3', '4'];

    var layers = {
        osmLight: {
            id: 'osmLight',
            name: GIS.i18n.osm_light,
            layerType: 'base',
            layerOpacity: 1,
            config: {
                type: 'tileLayer',
                url: '//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            }
        },
        openStreetMap: {
            id: 'openStreetMap',
            name: GIS.i18n.openstreetmap,
            layerType: 'base',
            layerOpacity: 1,
            config: {
                type: 'tileLayer',
                url: '//{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        },
        googleStreets: {
            id: 'googleStreets',
            name: GIS.i18n.google_streets,
            layerType: 'base',
            layerOpacity: 1,
            config: {
                type: 'googleLayer',
                style: 'ROADMAP',
                apiKey: gis.init.systemInfo.googleMapsKey
            }
        },
        googleHybrid: {
            id: 'googleHybrid',
            name: GIS.i18n.google_hybrid,
            layerOpacity: 1,
            layerType: 'base',
            config: {
                type: 'googleLayer',
                style: 'HYBRID',
                apiKey: gis.init.systemInfo.googleMapsKey
            }
        },
        earthEngine: {
            id: 'earthEngine',
            name: GIS.i18n.earthengine_layer,
            layerOpacity: 0.9,
            config: {
                pane: 'earthEngine'
            },
            handler: GIS.core.LayerHandlerEarthEngine
        },
        external: {
            id: 'external',
            name: GIS.i18n.external_layer,
            layerOpacity: 0.9,
            handler: GIS.core.LayerHandlerExternal
        },
        event: {
            id: 'event',
            name: GIS.i18n.event_layer,
            layerOpacity: 0.95,
            config: {
                type: 'dots',
                pane: 'event'
            },
            handler: GIS.core.LayerHandlerEvent
        },
        facility: {
            id: 'facility',
            name: GIS.i18n.facility_layer,
            layerOpacity: 1,
            zIndex: 150,
            config: {
                type: 'markers',
                pane: 'facility'
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
                type: 'boundary',
                pane: 'boundary'
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
            zIndex: 450 - (i * 10),
            config: {
                type: 'choropleth',
                pane: 'thematic' + number
            },
            handler: GIS.core.LayerHandlerThematic,
            featureStore:  Ext.create('Ext.data.Store', {
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
        };
    }

    return layers;
};