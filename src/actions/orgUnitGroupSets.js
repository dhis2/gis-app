import * as types from '../constants/actionTypes';

// Load all programs
export const loadOrgUnitGroupSets = () => ({
    type: types.ORGANISATION_UNIT_GROUP_SETS_LOAD,
});

// Set all programs
export const setOrgUnitGroupSets = (data) => ({
    type: types.ORGANISATION_UNIT_GROUP_SETS_SET,
    payload: data,
});

