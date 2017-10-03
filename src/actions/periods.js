import * as types from '../constants/actionTypes';

// Set relative periods
export const setRelativePeriods = (periods) => ({
    type: types.RELATIVE_PERIODS_SET,
    payload: periods
});

// Translate relative periods
export const translateRelativePeriods = () => ({
    type: types.RELATIVE_PERIODS_TRANSLATE,
});
