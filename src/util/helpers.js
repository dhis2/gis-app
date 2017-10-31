import { getInstance as getD2 } from 'd2/lib/d2';

const displayPropertyMap = {
    name: 'displayName',
    displayName: 'displayName',
    shortName: 'displayShortName',
    displayShortName: 'displayShortName',
};

// TODO: Do once and make avaialble in d2 settings?
export const getDisplayPropertyUrl = (name) => (displayPropertyMap[name] || 'displayName') + '~rename(name)';


export const getAnalyticsEvents = async (config) => {
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
