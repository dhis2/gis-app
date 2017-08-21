import * as types from '../constants/actionTypes';

const system = (state = {}, action) => {

    switch (action.type) {
        case types.SYSTEM_DATA_SET:
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;

    }
};

export default system;
