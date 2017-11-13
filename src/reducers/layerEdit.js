import * as types from '../constants/actionTypes';

const layerEdit = (state = null, action) => {
    let columns;
    let rows;
    let ouDim;
    let items;
    let newRows;

    switch (action.type) {

        case types.OVERLAY_EDIT:
            delete action.payload.img;
            return action.payload;

        case types.OVERLAY_CANCEL:
            return null;

        case types.LAYER_EDIT_PROGRAM_SET:
            return {
                ...state,
                program: {
                    ...action.program,
                },
                columns: [],
                programStage: null,
                styleDataElement: null,
            };

        case types.LAYER_EDIT_PROGRAM_STAGE_SET:
            return {
                ...state,
                programStage: {
                    ...action.programStage,
                },
                columns: [],
                styleDataElement: null,
            };

        case types.LAYER_EDIT_RELATIVE_PERIOD_SET:
            const filters = state.filters || [];
            const newFilters = filters.filter(r => r.dimension !== 'pe');

            if (action.period.id !== 'START_END_DATES') {
                newFilters.push({
                    dimension: 'pe',
                    items: [{
                        id: action.period.id,
                    }],
                });
            }

            return {
                ...state,
                filters: newFilters,
            };

        case types.LAYER_EDIT_START_DATE_SET:
            return {
                ...state,
                startDate: action.startDate,
            };

        case types.LAYER_EDIT_END_DATE_SET:
            return {
                ...state,
                endDate: action.endDate,
            };

        case types.LAYER_EDIT_FILTER_ADD:
            return {
                ...state,
                columns: [
                    ...state.columns,
                    action.filter || {
                        dimension: null,
                        name: null,
                        filter: null,
                    }
                ]
            };

        case types.LAYER_EDIT_FILTER_REMOVE:
            columns = state.columns.filter(c => c.filter !== undefined); // Also used for style data element without filter

            if (!columns || !columns[action.index]) {
                return state;
            }

            return {
                ...state,
                columns: [
                    ...state.columns.filter(c => c.filter === undefined),
                    ...columns.filter((c, i) => i !== action.index)
                ]
            };

        case types.LAYER_EDIT_FILTER_CHANGE:
            columns = state.columns.filter(c => c.filter !== undefined); // Also used for style data element without filter

            if (!columns || !columns[action.index]) {
                return state;
            }

            columns[action.index] = action.filter;

            return {
                ...state,
                columns: [
                    ...state.columns.filter(c => c.filter === undefined),
                    ...columns
                ]
            };

        case types.LAYER_EDIT_STYLE_DATA_ITEM_SET:
            return {
                ...state,
                styleDataItem: action.dataItem,
            };

        // Set options to data element option set
        case types.LAYER_EDIT_STYLE_DATA_ITEM_OPTIONS_SET:
            return {
                ...state,
                styleDataItem: {
                    ...state.styleDataItem,
                    optionSet: {
                        ...state.styleDataItem.optionSet,
                        options: action.options,
                    },
                },
            };

            return state;

        case types.LAYER_EDIT_EVENT_COORDINATE_FIELD_SET:
            const newState = { ...state };

            if (action.fieldId === 'event') { // Default
                delete newState.eventCoordinateField;
            } else {
                newState.eventCoordinateField = action.fieldId;
            }

            return newState;

        case types.LAYER_EDIT_EVENT_CLUSTERING_SET:
            return {
                ...state,
                eventClustering: action.checked,
            };

        case types.LAYER_EDIT_EVENT_POINT_RADIUS_SET:
            return {
                ...state,
                eventPointRadius: action.radius,
            };

        case types.LAYER_EDIT_EVENT_POINT_COLOR_SET:
            return {
                ...state,
                eventPointColor: action.color,
            };

        case types.LAYER_EDIT_ORGANISATION_UNIT_GROUP_SET:
            return {
                ...state,
                organisationUnitGroupSet: {
                    ...action.organisationUnitGroupSet,
                },
            };

      case types.LAYER_EDIT_ORGANISATIOM_UNIT_TOGGLE:
            rows = state.rows || [];
            ouDim = rows.filter(r => r.dimension === 'ou')[0];
            items = ouDim ? ouDim.items.filter((item) => item.id !== action.orgUnit.id) : [];
            newRows = rows.filter(r => r.dimension !== 'ou');

            if (!ouDim || ouDim.items.length === items.length) { // Don't exist already
                items.push(action.orgUnit);
            }

            if (items.length) {
                newRows.push({
                  dimension: 'ou',
                  items,
                });
            }

            return {
                ...state,
                rows: newRows,
            };

        default:
            return state;

    }
};

export default layerEdit;