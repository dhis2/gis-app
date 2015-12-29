GIS.core.getLayers = function(gis) {
    var layers = {},
        createSelectionHandlers,
        layerNumbers = ['1', '2', '3', '4'];

    //if (window.google) {
    //layers.googleStreets = new OpenLayers.Layer.Google('Google Streets', {
    //numZoomLevels: 20,
    //animationEnabled: true,
    //layerType: gis.conf.finals.layer.type_base,
    //layerOpacity: 1,
    //setLayerOpacity: function(number) {
    //if (number) {
    //this.layerOpacity = parseFloat(number);
    //}
    //this.setOpacity(this.layerOpacity);
    //}
    //});
    //layers.googleStreets.id = 'googleStreets';

    //layers.googleHybrid = new OpenLayers.Layer.Google('Google Hybrid', {
    //type: google.maps.MapTypeId.HYBRID,
    //numZoomLevels: 20,
    //animationEnabled: true,
    //layerType: gis.conf.finals.layer.type_base,
    //layerOpacity: 1,
    //setLayerOpacity: function(number) {
    //if (number) {
    //this.layerOpacity = parseFloat(number);
    //}
    //this.setOpacity(this.layerOpacity);
    //}
    //});
    //layers.googleHybrid.id = 'googleHybrid';
    //}

    /* TODO
     layers.openStreetMap = new OpenLayers.Layer.OSM.Mapnik('OpenStreetMap', {
     layerType: gis.conf.finals.layer.type_base,
     layerOpacity: 1,
     setLayerOpacity: function(number) {
     if (number) {
     this.layerOpacity = parseFloat(number);
     }
     this.setOpacity(this.layerOpacity);
     }
     });
     */
    layers.openStreetMap = {}; // TODO

    layers.openStreetMap.id = 'openStreetMap';

    /*
     layers.event = GIS.core.VectorLayer(gis, 'event', GIS.i18n.event_layer, {opacity: gis.conf.layout.layer.opacity});
     layers.event.core = new mapfish.GeoStat.Event(gis.olmap, {
     layer: layers.event,
     gis: gis
     });
     */

    layers.event = {
        id: 'event',
        name: GIS.i18n.event_layer
    };

    layers.event.getLoader = function() {
        return GIS.core.LayerLoaderEvent(gis, layers.event);
    };


    /*
    layers.event.core = {
        getLoader: function() {
            return GIS.core.LayerLoaderEvent(gis, layers.event);
        }
    };
    */

    /*
     layers.facility = GIS.core.VectorLayer(gis, 'facility', GIS.i18n.facility_layer, {opacity: 1});
     layers.facility.core = new mapfish.GeoStat.Facility(gis.olmap, {
     layer: layers.facility,
     gis: gis
     });
     */
    layers.facility = {
        id: 'facility',
        features: [] // TODO: Originally created by OL
    };

    layers.facility.core = {
        getLoader: function() {
            return GIS.core.LayerLoaderEvent(gis, layers.event);
        }
    };

    /*
     layers.boundary = GIS.core.VectorLayer(gis, 'boundary', GIS.i18n.boundary_layer, {opacity: 1});
     layers.boundary.core = new mapfish.GeoStat.Boundary(gis.olmap, {
     layer: layers.boundary,
     gis: gis
     });
     */
    layers.boundary = {
        id: 'boundary'
    };

    for (var i = 0, number; i < layerNumbers.length; i++) {
        number = layerNumbers[i];

        //layers['thematic' + number] = GIS.core.VectorLayer(gis, 'thematic' + number, GIS.i18n.thematic_layer + ' ' + number, {opacity: gis.conf.layout.layer.opacity});
        layers['thematic' + number] = {
            id: 'thematic' + number
        };

        layers['thematic' + number].layerCategory = gis.conf.finals.layer.category_thematic,
            /*
             layers['thematic' + number].core = new mapfish.GeoStat['Thematic' + number](gis.olmap, {
             layer: layers['thematic' + number],
             gis: gis
             });
             */
            layers['thematic' + number].core = {};
    }

    return layers;
};