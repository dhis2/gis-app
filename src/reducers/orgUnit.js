import * as actionTypes from '../constants/actionTypes';

const orgUnit = (state = null, action) => {
    switch (action.type) {

        case actionTypes.ORGANISATION_UNIT_OPEN:
            return {
                ...action.payload,
            };

        case actionTypes.ORGANISATION_UNIT_CLOSE:
            return null;

        /*
        case actionTypes.ORGANISATION_UNIT_RELOCATE:
            console.log('ORGANISATION_UNIT_RELOCATE', action);
            return state;

        case actionTypes.ORGANISATION_UNIT_SWAP_COORDINATE:
            console.log('ORGANISATION_UNIT_SWAP_COORDINATE', action);
            return state;
        */

        default:
            return state;

    }
};

export default orgUnit;

