import * as actionTypes from '../constants/actionTypes';

const relocate = (state = null, action) => {
    switch (action.type) {

        case actionTypes.ORGANISATION_UNIT_RELOCATE_START:
            return {
                layerId: action.layerId,
                feature: action.feature,
            };

        case actionTypes.ORGANISATION_UNIT_RELOCATE_STOP:
            return null;

        default:
            return state;

    }
};

export default relocate;
