import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';

export default function LayerHandlerEvent(gis, layer) {
    const spatialSupport = gis.init.systemInfo.databaseInfo.spatialSupport;
    const displayElements = {}; // Data elements to display in event popup
    let eventCoordinateFieldName; // Name of event coordinate field to show in popup

    const loadData = function(view) {
        view = view || layer.view;

        let paramString = '?';

        if (!view.programStage) {
            gis.alert(GIS.i18n.no_program_stage_selected);
            return;
        }

        // program stage
        paramString += 'stage=' + view.programStage.id;

        // period
        if (view.filters) {
            paramString += '&filter=pe:' + view.filters[0].items[0].id;
        } else {
            paramString += '&startDate=' + view.startDate;
            paramString += '&endDate=' + view.endDate;
        }

        // organisation units
        if (view.rows[0] && view.rows[0].dimension === 'ou' && isArray(view.rows[0].items)) {
            paramString += '&dimension=ou:' + view.rows[0].items.map(ou => ou.id).join(';');
        }

        // de
        if (view.columns) {
            view.columns.forEach(element => {
                if (element.dimension !== 'dx') { // API sometimes returns empty dx filter
                    paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');
                }
            });
        }

        // If coordinate field other than event coordinate
        if (view.eventCoordinateField) {
            paramString += '&dimension=' + view.eventCoordinateField; // Used by analytics/events/query/
            paramString += '&coordinateField=' + view.eventCoordinateField; // Used by analytics/events/count and analytics/events/cluster
        }

        // Only events with coordinates
        paramString += '&coordinatesOnly=true';

        const success = function(r) {
            const features = [];
            const rows = [];

            // Quickfix for: https://jira.dhis2.org/browse/DHIS2-502
            const names = {};
            Object.keys(r.metaData.items).forEach(key => names[key] = r.metaData.items[key].name);

            const booleanNames = {
                'true': GIS.i18n.yes || 'Yes',
                'false': GIS.i18n.no || 'No'
            };

            let lonIndex;
            let latIndex;
            let optionSetIndex;
            let optionSetHeader;

            const updateFeatures = function() {
                // Find header names and keys
                r.headers.forEach(header => names[header.name] = header.column);

                // Create GeoJSON features
                rows.forEach(row => {
                    const properties = {};
                    let coord;

                    // Build property object
                    row.forEach((value, i) => {
                        properties[r.headers[i].name] = booleanNames[value] || r.metaData.optionNames[value] || names[value] || value;
                    });

                    // If coordinate field other than event location
                    if (view.eventCoordinateField) {
                        const eventCoordinate = properties[view.eventCoordinateField];

                        if (isArray(eventCoordinate)) {
                            coord = eventCoordinate;
                        } else if (isString(eventCoordinate)) {
                            coord = JSON.parse(eventCoordinate);
                        }
                    } else { // Use event location
                        coord = [properties.longitude, properties.latitude];
                    }

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
                });

                updateMap(view, features);
            };

            const getOptionSets = function() {
                if (!optionSetHeader) {
                    updateFeatures();
                }
                else {
                    dhis2.gis.store.get('optionSets', optionSetHeader.optionSet).done(obj => {
                        Ext.apply(r.metaData.optionNames, gis.util.array.getObjectMap(obj.options, 'code', 'name'));
                        updateFeatures();
                    });
                }
            };

            r.metaData.optionNames = {};

            // name-column map, lonIndex, latIndex, optionSet
            r.headers.forEach((header, i) => {
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
            });

            // get events with coordinates
            if (isArray(r.rows) && r.rows.length) {
                r.rows.forEach(row => {
                    if (row[lonIndex] && row[latIndex]) {
                        rows.push(row);
                    }
                });
            }

            if (!rows.length) {
                gis.alert(GIS.i18n.no_event_coordinates_found);
                if (gis.mask) {
                    gis.mask.hide();
                }
                return;
            }

            // option set
            getOptionSets();
        };

        // Used if no spatial support and for client cluster
        const loadEvents = function() {
            Ext.Ajax.request({
                url: encodeURI(gis.init.analyticsPath + 'analytics/events/query/' + view.program.id + '.json' + paramString),
                disableCaching: false,
                failure(r) {
                    gis.alert(r);
                },
                success(r) {
                    success(JSON.parse(r.responseText));
                }
            });
        };

        const onEventCountSuccess = function(r) {
            if (r.extent) {
                const extent = r.extent.match(/([-\d\.]+)/g);
                const bounds = [[extent[1], extent[0]],[extent[3], extent[2]]];

                view.bounds = bounds;

                // Dont fit to bounds when layer is updated
                if (!layer.instance) {
                    gis.instance.fitBounds(bounds);
                }
            }

            if (r.count < 2000) { // Client clustering if less than 2000 events
                loadEvents();
            } else {
                let url = gis.init.analyticsPath + 'analytics/events/cluster/' + view.program.id + '.json' + paramString;

                updateMap(view, url);
            }
        };

        if (spatialSupport && view.eventClustering) { // Get event count to decide on client vs server cluster
            Ext.Ajax.request({
                url: encodeURI(gis.init.analyticsPath + 'analytics/events/count/' + view.program.id + '.json' + paramString),
                disableCaching: false,
                failure(r) {
                    gis.alert(r);
                },
                success(r) {
                    onEventCountSuccess(JSON.parse(r.responseText));
                }
            });
        } else {
            loadEvents();
        }

        // Get option sets by id (used for data elements i popup)
        const getDataElementOptionSets = function(dataElement){
            if (dataElement.optionSet && dataElement.optionSet.id) {
                dhis2.gis.store.get('optionSets', dataElement.optionSet.id).done(optionSet => {
                    optionSet.options.forEach(option => dataElement.optionSet[option.code] = option.name);
                });
            }
        };

        // Load data elements that should be displayed in popups
        const loadDataElements = function() {
            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'programStages/' + view.programStage.id + '.json?fields=programStageDataElements[displayInReports,dataElement[id,' + gis.init.namePropertyUrl + ',optionSet]]'),
                disableCaching: false,
                failure(r) {
                    gis.alert(r);
                },
                success(r) {
                    const data = JSON.parse(r.responseText);

                    if (data.programStageDataElements) {
                        data.programStageDataElements.forEach(el => {
                            if (el.displayInReports) {
                                displayElements[el.dataElement.id] = el.dataElement;
                                getDataElementOptionSets(el.dataElement);
                            } else if (view.eventCoordinateField && el.dataElement.id === view.eventCoordinateField) {
                                eventCoordinateFieldName = el.dataElement.name;
                            }

                        });
                    }
                }
            });
        }();

    };

    // Convert from DHIS 2 format to GeoJSON
    const toGeoJson = function(data) {
        const header = {};
        const features = [];

        // Convert headers to object for easier lookup
        data.headers.forEach((h, i) => header[h.name] = i);

        if (isArray(data.rows)) {
            data.rows.forEach(row => {
                const extent = row[header.extent].match(/([-\d\.]+)/g);
                const coords = row[header.center].match(/([-\d\.]+)/g);

                // Round to 6 decimals - http://www.jacklmoore.com/notes/rounding-in-javascript/
                coords[0] = Number(Math.round(coords[0] + 'e6') + 'e-6');
                coords[1] = Number(Math.round(coords[1] + 'e6') + 'e-6');

                features.push({
                    type: 'Feature',
                    id: row[header.points],
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    properties: {
                        count: parseInt(row[header.count], 10),
                        bounds: [[extent[1], extent[0]], [extent[3], extent[2]]]
                    }
                });
            });
        }

        return features;
    };

    // Called for every single marker click
    const onFeaturePopup = function(feature, callback) {
        const coord = feature.geometry.coordinates; // Show coordinate from feature

        Ext.Ajax.request({
            url: encodeURI(gis.init.apiPath + 'events/' + feature.id + '.json'),
            disableCaching: false,
            failure(r) {
                gis.alert(r);
            },
            success(r) {
                const data = JSON.parse(r.responseText);
                const time = data.eventDate.substring(0, 10) + ' ' + data.eventDate.substring(11, 16);
                const dataValues = data.dataValues;
                let content = '<table><tbody>';

                if (isArray(dataValues)) {
                    dataValues.forEach(dataValue => {
                        const displayEl = displayElements[dataValue.dataElement];

                        if (displayEl) {
                            let value = dataValue.value;

                            if (displayEl.optionSet) {
                                value = displayEl.optionSet[value];
                            }

                            content += `<tr><th>${displayEl.name}</th><td>${value}</td></tr>`;
                        }
                    });
                    content += '<tr style="height:5px;"><th></th><td></td></tr>';
                }

                content += `<tr><th>${GIS.i18n.organisation_unit}</th><td>${data.orgUnitName}</td></tr>
                            <tr><th>${GIS.i18n.event_time}</th><td>${time}</td></tr>
                            <tr><th>${eventCoordinateFieldName || GIS.i18n.event_location}</th><td>${coord[0]}, ${coord[1]}</td></tr>
                            </tbody></table>`

                callback(content);
            }
        });
    };

    // Add layer to map (features can also be cluster url)
    const updateMap = function(view, features) {
        let layerConfig;
        let layerUpdate = false;

        if (isString(features)) { // Server cluster
            layerConfig = Ext.applyIf({
                type: 'serverCluster',
                bounds: view.bounds,
                color: '#' + view.eventPointColor,
                radius:view.eventPointRadius,
                load(params, callback) { // Called for every tile load
                    Ext.Ajax.request({
                        url: encodeURI(features + '&bbox=' + params.bbox + '&clusterSize=' + params.clusterSize + '&includeClusterPoints=' + params.includeClusterPoints),
                        disableCaching: false,
                        failure(r) {
                            gis.alert(r);
                        },
                        success(r) {
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
            layerUpdate = true;
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        // Zoom
        if (!layerUpdate && handler.zoomToVisibleExtent && layer.instance.getBounds().isValid()) {
            gis.instance.fitBounds(layer.instance.getBounds());
        }

        afterLoad(view);
    };

    const afterLoad = function(view) {

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

    const handler = {
        compare: false,
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        load(view) {
            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            loadData(view);
        },
        loadData: loadData
    };

    return handler;
};
