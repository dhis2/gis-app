// TODO: Use d2? Make promise based? Wrap in closure?

import {isValidCoordinate} from '../util/map';
import isArray from 'd2-utilizr/lib/isArray';
import isString from 'd2-utilizr/lib/isString';

// TODO: How to share headers for all fetch requests?
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

const loadEvents = (paramString, layer, callback) => {
    const url = gis.init.analyticsPath + 'analytics/events/query/' + layer.program.id + '.json' + paramString

    console.log('loadEvents', layer);

    layer.title = layer.program.name;

    layer.legend = {
        items: [{
            radius: layer.eventPointRadius,
            color: '#' + layer.eventPointColor,
            name: 'Event', // TODO: i18n
        }]
    };

    fetch(encodeURI(url), {headers})
        .then(response => response.json())
        .then(data => onDataLoad(data, layer, callback))
        .catch(error => console.log('Parsing failed: ', error)); // TODO
};

const onDataLoad = (data, layer, callback) => {
    const features = [];
    const rows = [];
    const names = {...data.metaData.names};

    const booleanNames = {
        'true': GIS.i18n.yes || 'Yes',
        'false': GIS.i18n.no || 'No'
    };

    let lonIndex;
    let latIndex;
    let optionSetIndex;
    let optionSetHeader;

    data.metaData.optionNames = {};

    // name-column map, lonIndex, latIndex, optionSet
    data.headers.forEach((header, i) => {
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

        if (!rows.length) {
            gis.alert(GIS.i18n.no_event_coordinates_found);
            // gis.mask.hide();
            // return;
        }
    });

    // get events with coordinates
    if (isArray(data.rows) && data.rows.length) {
        data.rows.forEach(row => {
            if (row[lonIndex] && row[latIndex]) {
                rows.push(row);
            }
        });
    }



    const updateFeatures = function() {
        // Find header names and keys
        data.headers.forEach(header => names[header.name] = header.column);

        // Create GeoJSON features
        rows.forEach(row => {
            const properties = {};
            let coord;

            // Build property object
            row.forEach((value, i) => {
                properties[data.headers[i].name] = booleanNames[value] || data.metaData.optionNames[value] || names[value] || value;
            });

            // If coordinate field other than event location
            if (layer.eventCoordinateField) {
                const eventCoordinate = properties[layer.eventCoordinateField];

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

        layer.data = features;
        callback(layer);

        // console.log('features', features);


        // updateMap(view, features);
    };

    if (!optionSetHeader) {
        updateFeatures();
    } else {
        dhis2.gis.store.get('optionSets', optionSetHeader.optionSet).done(obj => {
            Ext.apply(data.metaData.optionNames, gis.util.array.getObjectMap(obj.options, 'code', 'name'));
            updateFeatures();
        });
    }

};

// Load events for map display
const eventLoader = (layer, callback) =>  {
    const spatialSupport = gis.init.systemInfo.databaseInfo.spatialSupport;
    const displayElements = {}; // Data elements to display in event popup
    let eventCoordinateFieldName; // Name of event coordinate field to show in popup
    let paramString = '?';

    if (!layer.programStage) {
        gis.alert(GIS.i18n.no_program_stage_selected); // TODO
        return;
    }

    // Program stage
    paramString += 'stage=' + layer.programStage.id;

    // Period
    if (layer.filters) {
        paramString += '&filter=pe:' + layer.filters[0].items[0].id;
    } else {
        paramString += '&startDate=' + layer.startDate;
        paramString += '&endDate=' + layer.endDate;
    }

    // Organisation units
    if (layer.rows[0] && layer.rows[0].dimension === 'ou' && isArray(layer.rows[0].items)) {
        paramString += '&dimension=ou:' + layer.rows[0].items.map(ou => ou.id).join(';');
    }

    // Dimension
    if (layer.columns) {
        layer.columns.forEach(element => {
            if (element.dimension !== 'dx') { // API sometimes returns empty dx filter
                paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');
            }
        });
    }

    // If coordinate field other than event coordinate
    if (layer.eventCoordinateField) {
        paramString += '&dimension=' + layer.eventCoordinateField; // Used by analytics/events/query/
        paramString += '&coordinateField=' + layer.eventCoordinateField; // Used by analytics/events/count and analytics/events/cluster
    }

    // Only events with coordinates
    paramString += '&coordinatesOnly=true';

    /*
    if (spatialSupport && layer.eventClustering) { // Get event count to decide on client vs server cluster
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
    */

    loadEvents(paramString, layer, callback);

    // console.log('eventLoader', paramString);






};

export default eventLoader;