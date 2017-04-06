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

export const relocateOrgUnit = () => {
    return {
        type: actionTypes.ORGANISATION_UNIT_RELOCATE,
    };
};

export function swapOrgUnitCoordinate(layerId, feature) {
    return dispatch => {
        const featureId = feature.properties.id;
        const swappedCoordinate = feature.geometry.coordinates.slice(0).reverse();

        changeCoordinate(featureId, swappedCoordinate)
            .then(response => {
                if (response.ok) {
                    // Update org. unit in redux store
                    dispatch({
                        type: actionTypes.ORGANISATION_UNIT_COORDINATE_CHANGE,
                        layerId,
                        featureId,
                        coordinate: swappedCoordinate,
                    });
                }
            })
            .catch(err => console.log('Error:', err)); // TODO
    }
}



