import { getInstance as getD2 } from 'd2/lib/d2';
import { isValidCoordinate } from '../util/map';
import { apiFetch } from '../util/api';
import isString from 'd2-utilizr/lib/isString';

const eventLoader = (config) =>
  addEventClusterOptions(config)
    .then(addStyleDataElement)
    .then(addEventData);

// Creates a param string from config object
const getParamString = (config) => {
    let paramString = '?';

    // Program stage
    paramString += 'stage=' + config.programStage.id;

    // Period
    if (Array.isArray(config.filters) && config.filters.length) {
        paramString += '&filter=pe:' + config.filters[0].items[0].id;
    } else {
        paramString += '&startDate=' + config.startDate;
        paramString += '&endDate=' + config.endDate;
    }

    // Organisation units
    if (config.rows[0] && config.rows[0].dimension === 'ou' && Array.isArray(config.rows[0].items)) {
        paramString += '&dimension=ou:' + config.rows[0].items.map(ou => ou.id).join(';');
    }

    // Dimensions
    config.columns.forEach(element => {
        if (element.dimension !== 'dx') { // API sometimes returns empty dx filter
            paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');
        }
    });

    return paramString;
};

const addEventClusterOptions = (config) => getD2().then((d2) => {
    const spatialSupport = d2.system.systemInfo.databaseInfo.spatialSupport;
    const paramString = getParamString(config);

    if (!spatialSupport && !config.eventClustering) {
      return config;
    }

    // Get event count to decide on client vs server cluster
    return apiFetch(`analytics/events/count/${config.program.id}.json${paramString}`)
        .then(response => {
            if (response.extent) {
                const extent = response.extent.match(/([-\d\.]+)/g);
                config.bounds = [[extent[1], extent[0]], [extent[3], extent[2]]];
            }

            if (response.count > 2000) { // Server clustering if more than 2000 events
                config.data = `analytics/events/cluster/${config.program.id}.json${paramString}`;
            }

            return config;
        });
});

const addStyleDataElement = (config) => {
  const styleDataElement = config.styleDataElement;

  // Include field for data element used for styling
  if (styleDataElement) {
    config.columns = [...config.columns, {
      dimension: styleDataElement.id,
      name: styleDataElement.name,
    }];
  }

  return config;
};

const addEventData = (config) => {
    const paramString = getParamString(config);

    if (config.data) {
        return config;
    }

    return apiFetch(`analytics/events/query/${config.program.id}.json${paramString}`)
        .then(data => parseEventData(config, data));
};

const parseEventData = (config, data) => {
  const names = { ...data.metaData.names };
  const features = data.rows.map(row => createEventFeature(config, data.headers, row));

  config.data = features;
  config.isLoaded = true;
  config.isExpanded = true;
  config.isVisible = true;

  return config;
};

const createEventFeature = (config, headers, event) => {
    const properties = event.reduce((props, value, i) => ({
        // properties[data.headers[i].name] = booleanNames[value] || data.metaData.optionNames[value] || names[value] || value;
        ...props,
        [headers[i].name]: value,
    }), {});

    const coordinates = [properties.longitude, properties.latitude];

    return {
        type: 'Feature',
        id: properties.psi,
        properties,
        geometry: {
            type: 'Point',
            coordinates,
        }
    };
};


/*

let layer;
let callback;
let paramString;

let filterTypes = {
    'IN': '=',
    'LE': '<=',
};


const loadEvents = () => {
    apiFetch(`analytics/events/query/${layer.program.id}.json${paramString}`)
        .then(data => onDataLoad(data, layer, callback));
};

const onDataLoad = (data) => {
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
    });

    // get events with coordinates
    if (isArray(data.rows) && data.rows.length) {
        data.rows.forEach(row => {
            if (row[lonIndex] && row[latIndex]) {
                rows.push(row);
            }
        });
    }

    if (!rows.length) {
        gis.alert(GIS.i18n.no_event_coordinates_found);
        // gis.mask.hide();
        return;
    }

    const updateFeatures = function() {
        let colorByOption;

        // Find header names and keys
        data.headers.forEach(header => names[header.name] = header.column);

        // Color by option set
        if (layer.styleDataElement && layer.styleDataElement.optionSet && layer.styleDataElement.optionSet.options) {
            colorByOption = layer.styleDataElement.optionSet.options;
        }

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

            if (colorByOption) {
                properties.color = colorByOption[properties[layer.styleDataElement.id]];
            }

            if (isValidCoordinate(coord)) {
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

const onEventCountLoad = (data) => {

    if (data.extent) {
        const extent = data.extent.match(/([-\d\.]+)/g);

        layer.bounds = [[extent[1], extent[0]],[extent[3], extent[2]]];

        // Dont fit to bounds when layer is updated
        // if (!layer.instance) { // TODO: Move to map layer handler
        //    gis.instance.fitBounds(bounds);
        // }
    }

    if (data.count < 2000) { // Client clustering if less than 2000 events
        loadEvents();
    } else { // Server clustering
        //layer.type = 'serverCluster',
        layer.type = 'event',
        layer.data = 'analytics/events/cluster/' + layer.program.id + '.json' + paramString;
        // layer.isLoaded = true;
        callback(layer);
    }
};

// Load events for map display
const eventLoader = (config, cb) =>  {
    layer = config;
    callback = cb;

    console.log('layer config', config);

    const spatialSupport = gis.init.systemInfo.databaseInfo.spatialSupport;
    const displayElements = {}; // Data elements to display in event popup
    let eventCoordinateFieldName; // Name of event coordinate field to show in popup
    let legendItemName = '' // TODO: i18n

    // Set title to program name
    layer.title = layer.program.name;

    // Build param string
    paramString = '?';

    if (!layer.programStage) {
        gis.alert(GIS.i18n.no_program_stage_selected); // TODO
        return;
    }

    // Program stage
    paramString += 'stage=' + layer.programStage.id;

    // Period
    if (isArray(layer.filters) && layer.filters.length) {
        paramString += '&filter=pe:' + layer.filters[0].items[0].id;
    } else {
        paramString += '&startDate=' + layer.startDate;
        paramString += '&endDate=' + layer.endDate;
    }

    // Organisation units
    if (layer.rows[0] && layer.rows[0].dimension === 'ou' && isArray(layer.rows[0].items)) {
        paramString += '&dimension=ou:' + layer.rows[0].items.map(ou => ou.id).join(';');
    }


    // Include field for data element used for styling - TODO: Move?
    if (layer.styleDataElement) {
        if (!layer.columns) {
            layer.columns = [];
        }

        layer.columns.push({
            dimension: layer.styleDataElement.id,
            name: layer.styleDataElement.name,
        });
    }

    // Dimension
    if (layer.columns) {
        console.log('layer.columns', layer.columns);

        layer.columns.forEach(element => {
            if (element.dimension !== 'dx') { // API sometimes returns empty dx filter
                paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');

                if (element.filter) {
                    const filter = element.filter.split(':');
                    const type = filterTypes[filter[0]];
                    const items = filter[1].split(';').join(', ');

                    // const filter = filters[element.filter.split(':')[0]];

                    legendItemName += element.name + ' ' + type + ' ' + items;
                }


            }
        });
    }



    // Create legend
    layer.legend = {
        description: 'Period: ', // TODO: i18n
        items: []
    };

    if (layer.styleDataElement) { // Style by data element
        const optionSet = layer.styleDataElement.optionSet;

        if (optionSet && optionSet.options) {
            layer.legend.items = Object.keys(optionSet.options).map(option => ({
                name: option,
                color: optionSet.options[option],
                radius: layer.eventPointRadius,
            }));

            layer.legend.items.push({
                radius: layer.eventPointRadius,
                color: layer.eventPointColor,
                name: 'Other', // TODO: i18n
            });
        }

    } else {
        console.log('####', legendItemName);


        layer.legend.items.push({
            radius: layer.eventPointRadius,
            color: layer.eventPointColor,
            name: legendItemName || 'Event', // TODO: i18n
        });
    }

    if (isArray(layer.filters) && layer.filters.length) {
        const period = layer.filters[0].items[0].id.replace(/_/g, ' ').toLowerCase();
        layer.legend.description += period;
    } else {
        layer.legend.description += layer.startDate + ' – '+ layer.endDate;
    }

    // console.log(JSON.stringify(layer));

    // If coordinate field other than event coordinate
    if (layer.eventCoordinateField) {
        paramString += '&dimension=' + layer.eventCoordinateField; // Used by analytics/events/query/
        paramString += '&coordinateField=' + layer.eventCoordinateField; // Used by analytics/events/count and analytics/events/cluster
    }

    // Only events with coordinates
    paramString += '&coordinatesOnly=true';

    if (spatialSupport && layer.eventClustering) { // Get event count to decide on client vs server cluster
        apiFetch('analytics/events/count/' + layer.program.id + '.json' + paramString)
            .then(data => onEventCountLoad(data));
    } else {
        loadEvents();
    }

};

*/

export default eventLoader;