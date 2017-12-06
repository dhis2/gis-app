import i18next from 'i18next';
import { getInstance as getD2 } from 'd2/lib/d2';
import isString from 'd2-utilizr/lib/isString';
import { isValidCoordinate } from '../util/map';
import { getAnalyticsRequest } from '../util/helpers';
import { getClassBins, getClass } from '../util/classify';
import { getNumericLegendItems, getCategoryLegendItems } from '../util/legend';
import { getFiltersFromColumns, getFiltersAsText, getPeriodFromFilters, getPeriodNameFromId } from '../util/analytics';
import { EVENT_COLOR, EVENT_RADIUS } from '../constants/styles';

// Look at: https://github.com/dhis2/maintenance-app/blob/master/src/App/appStateStore.js

const eventLoader = (config) =>
  initialize(config)
    .then(addEventClusterOptions)
    .then(addStyleDataItem)
    .then(addEventData)
    .then(addStyling)
    .then(addStatus);

const initialize = async (config) => { // To return a promise
    const filters = getFiltersFromColumns(config.columns);
    const period = getPeriodFromFilters(config.filters);

    const periodName = period ? getPeriodNameFromId(period.id) : `${config.startDate} - ${config.endDate}`;
    const legend = { period: periodName };

    if (filters) {
        legend.filters = getFiltersAsText(filters);
    }

    return {
        ...config,
        title: config.programStage.name,
        legend,
    };
};

const addEventClusterOptions = async (config) => {
    const d2 = await getD2();
    const spatialSupport = d2.system.systemInfo.databaseInfo.spatialSupport;

    console.log('config', config);

    if (!spatialSupport && !config.eventClustering) {
        return config;
    }

    const analyticsRequest = await getAnalyticsRequest(config);
    const response = await d2.analytics.events.getCount(analyticsRequest);

    if (response.extent) {
        const extent = response.extent.match(/([-\d\.]+)/g);
        config.bounds = [[extent[1], extent[0]], [extent[3], extent[2]]];
    }

    if (response.count > 2000) { // Server clustering if more than 2000 events
        config.serverCluster = true;
    }

    return config;
};

// Include column for data element used for styling
const addStyleDataItem = (config) => {
  const styleDataItem = config.styleDataItem;

  if (styleDataItem) {
    config.columns = [...config.columns, {
      dimension: styleDataItem.id,
      name: styleDataItem.name,
    }];
  }

  return config;
};

const addEventData = async (config) => {
    if (config.serverCluster) {
        return config;
    }

    const d2 = await getD2();
    const analyticsRequest = await getAnalyticsRequest(config);
    const data = await d2.analytics.events.getQuery(analyticsRequest);

    console.log(data);

    const { metadata, headers, rows } = data;
    const names = {
        // ...data.metaData.names, // TODO: In use?
        // ...data.metaData.optionNames, // TODO: In use? See below
        true: i18next.t('Yes'),
        false: i18next.t('No'),
    };

    // names[header.name] = header.column;

    // Find header names and keys - TODO: Needed?
    headers.forEach(header => names[header.name] = header.column);

    config.data = rows
      .map(row => createEventFeature(config, headers, names, row))
      .filter(feature => isValidCoordinate(feature.geometry.coordinates));

    return config;
};

const addStyling = (config) => {
    const { method, classes, colorScale, styleDataItem, data, legend, eventPointColor, eventPointRadius } = config;
    const hasData = Array.isArray(data) && data.length;
    const styleByNumeric = method && classes && colorScale;
    const styleByOptionSet = styleDataItem && styleDataItem.optionSet && styleDataItem.optionSet.options;

    if (hasData) {
        if (styleDataItem) {
            // Set value property to value of styleDataItem
            data.forEach(feature => feature.properties.value = feature.properties[styleDataItem.id]);
            legend.unit = styleDataItem.name;

            if (styleByNumeric) {
                const values = data.map(feature => Number(feature.properties.value)).sort((a, b) => a - b);
                const bins = getClassBins(values, method, classes);

                data.forEach(feature => feature.properties.color = colorScale[getClass(Number(feature.properties.value), bins) - 1]);
                legend.items = getNumericLegendItems(bins, colorScale, eventPointRadius);
            } else if (styleByOptionSet) {
                data.forEach(feature => feature.properties.color = styleDataItem.optionSet.options[feature.properties.value]);
                legend.items = getCategoryLegendItems(styleDataItem.optionSet.options, eventPointRadius);
            }

            legend.items.push({
                name: i18next.t('Not set'),
                color: eventPointColor || EVENT_COLOR,
                radius: eventPointRadius || EVENT_RADIUS,
            });
        } else { // Simple style
            legend.items = [{
                name: i18next.t('Event'),
                color: eventPointColor || EVENT_COLOR,
                radius: eventPointRadius || EVENT_RADIUS,
            }];
        }
    }

    return config;
};

const addStatus = (config) => {
    config.isLoaded = true;
    config.isExpanded = true;
    config.isVisible = true;

    return config;
};

/*** Helper functions below ***/


const createEventFeature = (config, headers, names, event) => {
    const properties = event.reduce((props, value, i) => ({
        ...props,
        [headers[i].name]: names[value] || value,
    }), {});

    /*
    if (properties.psi === 'wh2Ps1XJCAG') {
        console.log(properties);
    }
    */

    let coordinates;

    if (config.eventCoordinateField) { // If coordinate field other than event location
        const eventCoord = properties[config.eventCoordinateField];

        if (Array.isArray(eventCoord)) {
            coordinates = eventCoord;
        } else if (isString(eventCoord)) {
            coordinates = JSON.parse(eventCoord);
        }
    } else { // Use event location
        coordinates = [properties.longitude, properties.latitude]; // Event location
    }

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
const getAnalyticsEvents = async (config) => {
    const d2 = await getD2();
    const { program, programStage, rows, columns, filters, startDate, endDate, eventCoordinateField } = config;

    const analyticsEvents = d2.analytics.events
        .setProgram(program.id)
        .addParameters({
            stage: programStage.id,
            coordinatesOnly: true,
        });

    if (Array.isArray(filters) && filters.length) {
        analyticsEvents.addFilter('pe:' + filters[0].items[0].id);
    } else {
        analyticsEvents.addParameters({
            startDate: startDate,
            endDate: endDate,
        });
    }

    // Organisation units
    if (rows[0] && rows[0].dimension === 'ou' && Array.isArray(rows[0].items)) {
        analyticsEvents.addDimension('ou:' + rows[0].items.map(ou => ou.id).join(';'));
    }

    // Dimensions
    columns.forEach(el => {
        if (el.dimension !== 'dx') { // API sometimes returns empty dx filter
            analyticsEvents.addDimension(el.dimension + (el.filter ? ':' + el.filter : ''));
        }
    });

    // If coordinate field other than event coordinate
    if (eventCoordinateField) {
        analyticsEvents
            .addDimension(eventCoordinateField) // Used by analytics/events/query/
            .addParameters({
                coordinateField: eventCoordinateField, // Used by analytics/events/count and analytics/events/cluster
            });
    }

    return analyticsEvents;
};
*/





/*
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
 */


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