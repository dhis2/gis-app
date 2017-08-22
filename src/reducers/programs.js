import * as types from '../constants/actionTypes';

const programs = (state = [], action) => {

    switch (action.type) {
        case types.PROGRAMS_SET:
            return action.payload;

        default:
            return state;

    }
};

export default programs;
