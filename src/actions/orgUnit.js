import * as actionTypes from '../constants/actionTypes';
import { changeCoordinate } from '../util/orgUnit';

export const openOrgUnit = attr => {
    return {
        type: actionTypes.ORGANISATION_UNIT_OPEN,
        payload: attr,
    };
};

export const closeOrgUnit = () => {
    return {
        type: actionTypes.ORGANISATION_UNIT_CLOSE,
    };
};

export const startRelocateOrgUnit = (layerId, feature) => {
    return {
        type: actionTypes.ORGANISATION_UNIT_RELOCATE_START,
        layerId,
        feature,
    };
};

export const stopRelocateOrgUnit = (layerId, feature) => {
    return {
        type: actionTypes.ORGANISATION_UNIT_RELOCATE_STOP,
        layerId,
        feature,
    };
};

export function changeOrgUnitCoordinate(layerId, featureId, coordinate) {
    return dispatch => {
        changeCoordinate(featureId, coordinate)
            .then(response => {
                if (response.ok) {
                    // Update org. unit in redux store
                    dispatch({
                        type: actionTypes.ORGANISATION_UNIT_COORDINATE_CHANGE,
                        layerId,
                        featureId,
                        coordinate,
                    });
                }
            })
            .catch(err => console.log('Error:', err)); // TODO
    }
}





