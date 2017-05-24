import * as types from '../constants/actionTypes';
import { changeCoordinate } from '../util/orgUnit';

export const openOrgUnit = (attr) => ({
    type: types.ORGANISATION_UNIT_OPEN,
    payload: attr,
});

export const closeOrgUnit = () => ({
    type: types.ORGANISATION_UNIT_CLOSE,
});

export const selectOrgUnit = (layerId, featureId) => ({
    type: types.ORGANISATION_UNIT_SELECT,
    layerId,
    featureId,
});

export const unselectOrgUnit = (layerId, featureId) => ({
    type: types.ORGANISATION_UNIT_UNSELECT,
    layerId,
    featureId,
});

export const filterOrgUnits = (layerId, filter) => ({
    type: types.ORGANISATION_UNITS_FILTER,
    layerId,
    filter,
});

export const unfilterOrgUnits = (layerId, filter) => ({
    type: types.ORGANISATION_UNITS_UNFILTER,
    layerId,
    filter,
});

export const startRelocateOrgUnit = (layerId, feature) => ({
    type: types.ORGANISATION_UNIT_RELOCATE_START,
    layerId,
    feature,
});

export const stopRelocateOrgUnit = (layerId, feature) => ({
    type: types.ORGANISATION_UNIT_RELOCATE_STOP,
    layerId,
    feature,
});

export const changeOrgUnitCoordinate = (layerId, featureId, coordinate) => (dispatch) => {
    changeCoordinate(featureId, coordinate)
        .then(response => {
            if (response.ok) {
                // Update org. unit in redux store
                dispatch({
                    type: types.ORGANISATION_UNIT_COORDINATE_CHANGE,
                    layerId,
                    featureId,
                    coordinate,
                });
            }
        })
        .catch(err => console.log('Error:', err)); // TODO
};





