import * as types from '../constants/actionTypes';

const user = (state = {}, action) => {

    switch (action.type) {
        case types.USER_SET:
            return {
                ...action.payload
            };

        default:
            return state;

    }
};

export default user;
