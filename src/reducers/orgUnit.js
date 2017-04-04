import * as actionTypes from '../constants/actionTypes';

const orgUnit = (state = null, action) => {
    switch (action.type) {

        case actionTypes.ORGANISATION_UNIT_OPEN:
            return {
                ...action.payload,
            };

        case actionTypes.ORGANISATION_UNIT_CLOSE:
            return null;

        default:
            return state;

    }
};

export default orgUnit;

