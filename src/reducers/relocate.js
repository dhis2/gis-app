import * as actionTypes from '../constants/actionTypes';

const relocate = (state = null, action) => {
    switch (action.type) {

        case actionTypes.ORGANISATION_UNIT_RELOCATE:
            return {
                layerId: action.layerId,
                feature: action.feature,
            };

        default:
            return state;

    }
};

export default relocate;
