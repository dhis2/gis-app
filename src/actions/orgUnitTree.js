import * as types from '../constants/actionTypes';

// Load all programs
export const loadOrgUnitTree = () => ({
    type: types.ORGANISATION_UNIT_TREE_LOAD,
});

// Set all programs
export const setOrgUnitTree = (rootModel) => ({
    type: types.ORGANISATION_UNIT_TREE_SET,
    payload: rootModel,
});

