import * as types from '../constants/actionTypes';
import { getOptionSet } from './optionSets';

// Set program used (event layer)
export const setProgram = (program) => ({
    type: types.LAYER_EDIT_PROGRAM_SET,
    program,
});

// Set program stage used (event layer)
export const setProgramStage = (programStage) => ({
    type: types.LAYER_EDIT_PROGRAM_STAGE_SET,
    programStage,
});

export const addDataElementFilter = (filter) => ({
    type: types.LAYER_EDIT_DATA_ELEMENT_FILTER_ADD,
    filter,
});

export const removeDataElementFilter = (index) => ({
    type: types.LAYER_EDIT_DATA_ELEMENT_FILTER_REMOVE,
    index,
});

export const changeDataElementFilter = (index, filter) => ({
    type: types.LAYER_EDIT_DATA_ELEMENT_FILTER_CHANGE,
    index,
    filter,
});

// Set data element used for styling (event layer)
export const setStyleDataElement = (dataElement) => ({
    type: types.LAYER_EDIT_STYLE_DATA_ELEMENT_SET,
    dataElement,
});

// Set options for style data element with option set (options are loaded separately) (event layer)
export const setStyleOptions = (options) => ({
    type: types.LAYER_EDIT_STYLE_DATA_ELEMENT_OPTIONS_SET,
    options,
});

// Set if event clustering should be used (event layer)
export const setEventClustering = (checked) => ({
    type: types.LAYER_EDIT_EVENT_CLUSTERING_SET,
    checked,
});

// Set event point radius (event layer)
export const setEventPointRadius = (radius) => ({
    type: types.LAYER_EDIT_EVENT_POINT_RADIUS_SET,
    radius,
});

// Set event point color (event layer)
export const setEventPointColor = (color) => ({
    type: types.LAYER_EDIT_EVENT_POINT_COLOR_SET,
    color,
});

export const toggleOrganisationUnit = (orgUnit) => ({
    type: types.LAYER_EDIT_ORGANISATIOM_UNIT_TOGGLE,
    orgUnit,
});

export const toggleUserOrganisationUnit = (orgUnit) => ({
    type: types.LAYER_EDIT_USER_ORGANISATIOM_UNIT_TOGGLE,
    orgUnit,
});

// Set organisation unit group set (facility layer)
export const setOrganisationUnitGroupSet = (organisationUnitGroupSet) => ({
    type: types.LAYER_EDIT_ORGANISATION_UNIT_GROUP_SET,
    organisationUnitGroupSet,
});

// Set relative period
export const setRelativePeriod = (period) => ({
    type: types.LAYER_EDIT_RELATIVE_PERIOD_SET,
    period,
});

// Set start date
export const setStartDate = (startDate) => ({
    type: types.LAYER_EDIT_START_DATE_SET,
    startDate,
});

// Set end date
export const setEndDate = (endDate) => ({
    type: types.LAYER_EDIT_END_DATE_SET,
    endDate,
});
