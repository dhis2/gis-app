import * as actionTypes from '../constants/actionTypes';

export const openDataTable = (id, data) => ({
    type: actionTypes.DATA_TABLE_OPEN_REQUESTED,
    id,
    data,
});

export const closeDataTable = () => ({
    type: actionTypes.DATA_TABLE_CLOSE_REQUESTED,
});