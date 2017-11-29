import { getInstance as getD2 } from 'd2/lib/d2';

const displayPropertyMap = {
    name: 'displayName',
    displayName: 'displayName',
    shortName: 'displayShortName',
    displayShortName: 'displayShortName',
};

// TODO: Do once and make avaialble in d2 settings?
export const getDisplayPropertyUrl = (name) => (displayPropertyMap[name] || 'displayName') + '~rename(name)';


export const getAnalyticsRequest = async (config) => {
    const d2 = await getD2();
    const { program, programStage, rows, columns, filters, startDate, endDate, eventCoordinateField } = config;

    let analyticsRequest = new d2.analytics.request()
        .withProgram(program.id)
        .withStage(programStage.id)
        .withCoordinatesOnly(true);


    // TODO: Temp solution to clear dimension and filters
    // const analyticsEvents = d2.analytics.events;
    //analyticsEvents.dimensions = [];
    //analyticsEvents.filters = [];

    /*
    analyticsEvents
        .setProgram(program.id)
        .addParameters({
            stage: programStage.id,
            coordinatesOnly: true,
        });
        */

    if (Array.isArray(filters) && filters.length) {
        analyticsRequest = analyticsRequest.addPeriodFilter(filters[0].items[0].id);
    } else {
        analyticsRequest = analyticsRequest
            .withStartDate(startDate)
            .withEndDate(endDate);
    }

    // Organisation units
    if (rows[0] && rows[0].dimension === 'ou' && Array.isArray(rows[0].items)) {
        analyticsRequest = analyticsRequest.addOrgUnitDimension(rows[0].items.map(ou => ou.id));
    }

    // Dimensions
    columns.forEach(el => {
        if (el.dimension !== 'dx') { // API sometimes returns empty dx filter
            analyticsRequest = analyticsRequest.addDimension(el.dimension, el.filter);
        }
    });

    // If coordinate field other than event coordinate
    if (eventCoordinateField) {
        analyticsRequest = analyticsRequest
            .addDimension(eventCoordinateField) // Used by analytics/events/query/
            .withCoorindateField(eventCoordinateField); // Used by analytics/events/count and analytics/events/cluster
    }

    return analyticsRequest;
};
