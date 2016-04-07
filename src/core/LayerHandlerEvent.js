import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';

export default function LayerHandlerEvent(gis, layer) {
    var spatialSupport = gis.init.systemInfo.databaseInfo.spatialSupport,
        compareView,
        loadData,
        afterLoad,
        toGeoJson,
        updateMap,
        handler,
        onFeaturePopup,
        displayElements = {}; // Data elements to display in event popup

    loadData = function(view) {
        var paramString = '?',
            organisationUnits,
            loadEvents,
            getDataElementOptionSets,
            loadDataElements,
            onEventCountSuccess,
            success;

        view = view || layer.view;

        if (!view.programStage) {
            gis.alert('No program stage selected');
            return;
        }

        // program stage
        paramString += 'stage=' + view.programStage.id;

        // dates
        paramString += '&startDate=' + view.startDate;
        paramString += '&endDate=' + view.endDate;

        // organisation units
        if (view.rows[0] && view.rows[0].dimension === 'ou' && isArray(view.rows[0].items)) {
            organisationUnits = view.rows[0].items;
            paramString += '&dimension=ou:';

            for (var i = 0; i < organisationUnits.length; i++) {
                paramString += organisationUnits[i].id;
                paramString += i < organisationUnits.length - 1 ? ';' : '';
            }
        }

        // de
        if (view.columns) {
            for (var i = 0, element; i < view.columns.length; i++) {
                element = view.columns[i];
                paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');
            }
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
                updateFeatures,
                getOptionSets;

            updateFeatures = function() {
                // Find header names and keys
                for (var i = 0, header; i < r.headers.length; i++) {
                    header = r.headers[i];
                    names[header.name] = header.column;
                }

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

                updateMap(view, features);
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
                url: encodeURI(gis.init.contextPath + '/api/analytics/events/query/' + view.program.id + '.json' + paramString),
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
            if (r.extent && r.extent !== 'null') {
                var extent = r.extent.match(/([-\d\.]+)/g),
                    bounds = [[extent[1], extent[0]],[extent[3], extent[2]]];

                gis.instance.fitBounds(bounds);
                view.bounds = bounds;
            }


            if (r.count < 2000) { // Client clustering if less than 2000 events
                loadEvents();
            } else { // Server clustering
                var url = gis.init.contextPath + '/api/analytics/events/cluster/' + view.program.id + '.json' + paramString
                updateMap(view, url);
            }
        };

        if (spatialSupport && view.eventClustering) { // Get event count to decide on client vs server cluster
            Ext.Ajax.request({
                url: encodeURI(gis.init.contextPath + '/api/analytics/events/count/' + view.program.id + '.json' + paramString),
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

        // Get option sets by id (used for data elements i popup)
        getDataElementOptionSets = function(dataElement){
            if (dataElement.optionSet && dataElement.optionSet.id) {
                dhis2.gis.store.get('optionSets', dataElement.optionSet.id).done(function(optionSet) {
                    for (var i = 0, option; i < optionSet.options.length; i++) {
                        option = optionSet.options[i];
                        dataElement.optionSet[option.code] = option.name;
                    }
                });
            }
        };

        // Load data elements that should be displayed in popups
        loadDataElements = function() {
            Ext.Ajax.request({
                url: encodeURI(gis.init.contextPath + '/api/programStages/' + view.programStage.id + '.json?fields=programStageDataElements[displayInReports,dataElement[id,' + gis.init.namePropertyUrl + ',optionSet]]'),
                disableCaching: false,
                failure: function(r) {
                    gis.alert(r);
                },
                success: function(r) {
                    var data = JSON.parse(r.responseText);

                    if (data.programStageDataElements) {
                        for (var i = 0, el; i < data.programStageDataElements.length; i++) {
                            el = data.programStageDataElements[i];

                            if (el.displayInReports) {
                                displayElements[el.dataElement.id] = el.dataElement;
                                getDataElementOptionSets(el.dataElement);
                            }
                        }
                    }
                }
            });
        }();

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

    // Called for every single marker click
    onFeaturePopup = function(feature, callback) {
        Ext.Ajax.request({
            url: encodeURI(gis.init.contextPath + '/api/events/' + feature.id + '.json'),
            disableCaching: false,
            failure: function(r) {
                gis.alert(r);
            },
            success: function(r) {
                var data = JSON.parse(r.responseText),
                    dataValues = data.dataValues,
                    content = '<table><tbody>';

                if (isArray(dataValues)) {

                    for (var i = 0, dataValue, displayEl, value; i < dataValues.length; i++) {
                        dataValue = dataValues[i];
                        displayEl = displayElements[dataValue.dataElement];

                        if (displayEl) {
                            value = dataValue.value;

                            if (displayEl.optionSet) {
                                value = displayEl.optionSet[value];
                            }

                            content += '<tr><th>' + displayEl.name + '</th><td>' + value + '</td></tr>';
                        }
                    }
                    content += '<tr style="height:5px;"><th></th><td></td></tr>';
                }

                // Fetch org unit name (might be possible to get in the same request later)
                // https://blueprints.launchpad.net/dhis2/+spec/tracked-entity-instance-endpoint
                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/organisationUnits/' + data.orgUnit + '.json?fields=displayName'),
                    disableCaching: false,
                    failure: function(r) {
                        gis.alert(r);
                    },
                    success: function(r) {
                        var orgUnit = JSON.parse(r.responseText);

                        content += '<tr><th>Organisation unit</th><td>' + orgUnit.displayName + '</td></tr>';
                        content += '<tr><th>Event date</th><td>' + data.eventDate + '</td></tr>';

                        if (data.coordinate) {
                            content += '<tr><th>Longitude</th><td>' + data.coordinate.longitude.toFixed(6) + '</td></tr>';
                            content += '<tr><th>Latitude</th><td>' + data.coordinate.latitude.toFixed(6) + '</td></tr>';
                        }

                        content += '</tbody></table>';
                        callback(content);
                    }
                });
            }
        });
    };

    // Add layer to map
    updateMap = function(view, features) {
        var layerConfig;

        if (typeof features === 'string') { // Server cluster
            layerConfig = Ext.applyIf({
                type: 'serverCluster',
                bounds: view.bounds,
                color: '#' + view.eventPointColor,
                radius:view.eventPointRadius,
                load: function(params, callback){ // Called for every tile load
                    Ext.Ajax.request({
                        url: encodeURI(features + '&bbox=' + params.bbox + '&clusterSize=' + params.clusterSize + '&includeClusterPoints=' + params.includeClusterPoints),
                        disableCaching: false,
                        failure: function(r) {
                            gis.alert(r);
                        },
                        success: function(r) {
                            callback(params.tileId, toGeoJson(JSON.parse(r.responseText)));
                        }
                    });
                },
                popup: onFeaturePopup
            }, layer.config);
        } else if (view.eventClustering) { // Client cluster
            layerConfig = Ext.applyIf({
                type: 'clientCluster',
                data: features,
                popup: onFeaturePopup,
                color: '#' + view.eventPointColor,
                radius: view.eventPointRadius
            }, layer.config);
        } else {
            layerConfig = Ext.applyIf({ // Client dot density map
                data: features,
                popup: onFeaturePopup,
                color: '#' + view.eventPointColor,
                radius: view.eventPointRadius
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

            loadData(view);
        },
        loadData: loadData
    };

    return handler;
};