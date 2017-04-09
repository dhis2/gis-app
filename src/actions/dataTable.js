import * as actionTypes from '../constants/actionTypes';

export const openDataTable = (id) => ({
    type: actionTypes.DATA_TABLE_OPEN_REQUESTED,
    id,
});

export const closeDataTable = () => ({
    type: actionTypes.DATA_TABLE_CLOSE_REQUESTED,
});