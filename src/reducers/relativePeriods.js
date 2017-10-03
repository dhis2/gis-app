import * as types from '../constants/actionTypes';

const relativePeriods = (state = [], action) => {

    switch (action.type) {
        case types.RELATIVE_PERIODS_SET:
            return action.payload;

        default:
            return state

    }
};

export default relativePeriods;
