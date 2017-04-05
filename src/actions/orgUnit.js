import * as actionTypes from '../constants/actionTypes';

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


export function getOrgUnit() {
    return dispatch => {
        // dispatch(loading()); // Gives error: Warning: setState(...): Cannot update during an existing state transition

        // console.log('getOverlay', layer);

        /*
        return fetchOverlay(layer).then(layer => {
            //  console.log('LOADED', layer);

            if (layer.editCounter === 1) { // Add new layer
                dispatch(addOverlay(layer));
            } else { // Update existing layer
                dispatch(updateOverlay(layer));
            }

            dispatch(loaded());
        });
        */
    }
}

