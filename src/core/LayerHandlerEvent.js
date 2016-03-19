import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';

export default function LayerHandlerEvent(gis, layer) {
    var spatialSupport = gis.init.systemInfo.databaseInfo.spatialSupport,
        loadOrganisationUnits,
        loadData,
        afterLoad,
        toGeoJson,
        updateMap,
        updateClusterMap, // TODO
        handler;

    loadOrganisationUnits = function(view) {
        loadData(view);
    };

    loadData = function(view) {
        var paramString = '?',
            loadEvents,
            onEventCountSuccess,
            success;

        view = view || layer.view;

        if (!view.stage) {
            // TODO: Add error message
            gis.mask.hide();
            return;
        }

        // stage
        paramString += 'stage=' + view.stage.id;

        // console.log('stage id', view.stage.id, view.program.id);

        // dates
        paramString += '&startDate=' + view.startDate;
        paramString += '&endDate=' + view.endDate;

        // ou
        if (isArray(view.organisationUnits)) {
            paramString += '&dimension=ou:';

            for (var i = 0; i < view.organisationUnits.length; i++) {
                paramString += view.organisationUnits[i].id;
                paramString += i < view.organisationUnits.length - 1 ? ';' : '';
            }
        }

        // de
        for (var i = 0, element; i < view.dataElements.length; i++) {
            element = view.dataElements[i];
            paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');
        }

        // Only events with coordinates
        paramString += '&coordinatesOnly=true';

        success = function(r) {
            var features = [],
                rows = [],
                lonIndex,
                latIndex,
                optionSetIndex,
                optionSetHeader,
                names = Ext.clone(r.metaData.names),
                booleanNames = {
                    'true': GIS.i18n.yes || 'Yes',
                    'false': GIS.i18n.no || 'No'
                },
                popupKeys = [ // Default popup keys
                    'ouname',
                    'eventdate',
                    'longitude',
                    'latitude'
                ],
                ignoreKeys = [
                    'eventdate',
                    'latitude',
                    'longitude',
                    'ou',
                    'oucode',
                    'ouname',
                    'psi',
                    'ps'
                ],
                popup,
                updateFeatures,
                getOptionSets;

            updateFeatures = function() {
                // Find header names and keys
                for (var i = 0, header; i < r.headers.length; i++) {
                    header = r.headers[i];
                    names[header.name] = header.column;

                    if (!arrayContains(ignoreKeys, header.name)) {
                        popupKeys.push(header.name);
                    }
                }

                // Shorter header name for popup
                names['ouname'] = names['ou'];

                // Create popup template
                popup = '<table>';
                for (var i = 0, key; i < popupKeys.length; i++) {
                    key = popupKeys[i];
                    popup += '<tr><th>' + names[key] + '</th><td>{' + key + '}</td></tr>';
                }
                popup += '</table>';

                // Create GeoJSON features
                for (var i = 0, row, properties, coord; i < rows.length; i++) {
                    row = rows[i];
                    properties = {};

                    // Build property object
                    for (var j = 0, value; j < row.length; j++) {
                        value = row[j];
                        properties[r.headers[j].name] = booleanNames[value] || r.metaData.optionNames[value] || names[value] || value;
                    }

                    coord = [properties.longitude, properties.latitude];

                    if (gis.util.map.isValidCoordinate(coord)) {
                        features.push({
                            type: 'Feature',
                            id: properties.psi,
                            properties: properties,
                            geometry: {
                                type: 'Point',
                                coordinates: coord
                            }
                        });
                    }
                }

                updateMap(view, features, popup);
            };

            getOptionSets = function() {
                if (!optionSetHeader) {
                    updateFeatures();
                }
                else {
                    dhis2.gis.store.get('optionSets', optionSetHeader.optionSet).done( function(obj) {
                        Ext.apply(r.metaData.optionNames, gis.util.array.getObjectMap(obj.options, 'code', 'name'));
                        updateFeatures();
                    });
                }
            };

            r.metaData.optionNames = {};

            // name-column map, lonIndex, latIndex, optionSet
            for (var i = 0, header; i < r.headers.length; i++) {
                header = r.headers[i];

                names[header.name] = header.column;

                if (header.name === 'longitude') {
                    lonIndex = i;
                }

                if (header.name === 'latitude') {
                    latIndex = i;
                }

                if (isString(header.optionSet) && header.optionSet.length) {
                    optionSetIndex = i;
                    optionSetHeader = header;
                }
            }

            // get events with coordinates
            if (isArray(r.rows) && r.rows.length) {
                for (var i = 0, row; i < r.rows.length; i++) {
                    row = r.rows[i];

                    if (row[lonIndex] && row[latIndex]) {
                        rows.push(row);
                    }
                }
            }

            if (!rows.length) {
                gis.alert('No event coordinates found');
                gis.mask.hide();
                return;
            }

            // option set
            getOptionSets();
        };

        // Used if no spatial support and for client cluster
        loadEvents = function() {
            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/analytics/events/query/' + view.program.id + '.json' + paramString,
                disableCaching: false,
                failure: function(r) {
                    gis.alert(r);
                },
                success: function(r) {
                    success(JSON.parse(r.responseText));
                }
            });
        };

        onEventCountSuccess = function(r) {
            var extent = r.extent.match(/([-\d\.]+)/g),
                bounds = [[extent[1], extent[0]],[extent[3], extent[2]]];

            gis.instance.fitBounds(bounds);
            view.bounds = bounds;

            //if (r.count < 2000) { // Client clustering
            if (r.count < 20) { // Client clustering
                loadEvents();
            } else { // Server clustering
                var url = gis.init.contextPath + '/api/analytics/events/cluster/' + view.program.id + '.json' + paramString
                updateMap(view, url, 'Popup');
            }
        };

        if (spatialSupport && view.cluster) { // Get event count to decide on client vs server cluster
            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/analytics/events/count/' + view.program.id + '.json' + paramString,
                disableCaching: false,
                failure: function(r) {
                    gis.alert(r);
                },
                success: function(r) {
                    onEventCountSuccess(JSON.parse(r.responseText));
                }
            });
        } else {
            loadEvents();
        }
    };

    // Convert from DHIS 2 format to GeoJSON
    toGeoJson = function(data) {
        var header = {},
            features = [];

        // Convert headers to object for easier lookup
        for (var i = 0; i < data.headers.length; i++) {
            header[data.headers[i].name] = i;
        }

        if (isArray(data.rows)) {
            for (var i = 0, row, extent; i < data.rows.length; i++) {
                row = data.rows[i];
                extent = row[header.extent].match(/([-\d\.]+)/g);

                features.push({
                    type: 'Feature',
                    id: row[header.points],
                    geometry: {
                        type: 'Point',
                        coordinates: row[header.center].match(/([-\d\.]+)/g)
                    },
                    properties: {
                        count: parseInt(row[header.count], 10),
                        bounds: [[extent[1], extent[0]], [extent[3], extent[2]]]
                    }
                });
            }
        }

        return features;
    };

    // Add layer to map
    updateMap = function(view, features, popup) {
        var layerConfig;

        if (typeof features === 'string') { // Server cluster
            layerConfig = Ext.applyIf({
                type: 'serverCluster',
                //popup: popup,
                bounds: view.bounds,
                color: '#' + view.color,
                radius: view.radius,
                load: function(params, callback){ // Called for every tile load
                    Ext.Ajax.request({
                        url: features + '&bbox=' + params.bbox + '&clusterSize=' + params.clusterSize + '&includeClusterPoints=' + params.includeClusterPoints,
                        disableCaching: false,
                        failure: function(r) {
                            gis.alert(r);
                        },
                        success: function(r) {
                            callback(params.tileId, toGeoJson(JSON.parse(r.responseText)));
                        }
                    });
                },
                popup: function(feature, callback) { // Called for every single marker click
                    Ext.Ajax.request({
                        url: gis.init.contextPath + '/api/events/' + feature.id + '.json',
                        disableCaching: false,
                        failure: function(r) {
                            gis.alert(r);
                        },
                        success: function(r) {
                            var data = JSON.parse(r.responseText);
                            callback(feature.id);
                        }
                    });
                }
            }, layer.config);
        } else if (view.cluster) { // Client cluster
            layerConfig = Ext.applyIf({
                type: 'clientCluster',
                data: features,
                popup: popup,
                color: '#' + view.color,
                radius: view.radius,
            }, layer.config);
        } else {
            layerConfig = Ext.applyIf({
                data: features,
                popup: popup,
                style: {
                    radius: view.radius,
                    fillColor: '#' + view.color,
                    fillOpacity: 1,
                    color: '#fff',
                    weight: 1
                }
            }, layer.config);
        }

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        // Put map layers in correct order: https://github.com/dhis2/dhis2-gis/issues/9
        //gis.util.map.orderLayers();

        afterLoad(view);
    };

    updateClusterMap = function (view) {
        var layerConfig = {
            //type: 'serverCluster',
            type: 'cluster',
            //clustering: 'server',
            api: 'http://dhis2.cartodb.com/api/v2/sql?q=',
            query: 'SELECT count(*), ST_Extent(the_geom) AS extent FROM {table}',
            table: 'programstageinstance',
            //opacity: 0.2,
            color: '#' + view.color,
            radius: view.radius
        };

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        // Put map layers in correct order: https://github.com/dhis2/dhis2-gis/issues/9
        //gis.util.map.orderLayers();
    };

    afterLoad = function(view) {

        layer.view = view;

        // Layer
        if (layer.item) {
            layer.item.setValue(true, view.opacity);
        }
        else {
            layer.instance.setOpacity(view.opacity);
        }

        // Gui
        if (handler.updateGui && isObject(layer.widget)) {
            layer.widget.setGui(view);
        }

        // Zoom
        if (handler.zoomToVisibleExtent && layer.instance.getBounds) {
            gis.instance.fitBounds(layer.instance.getBounds());
        }

        // Mask
        if (handler.hideMask) {
            gis.mask.hide();
        }

        // Map callback
        if (handler.callBack) {
            handler.callBack(layer);
        }
        else {
            gis.map = null;
        }
    };

    handler = {
        compare: false,
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        load: function(view) {

            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            loadOrganisationUnits(view);
        },
        loadData: loadData
    };

    return handler;
};