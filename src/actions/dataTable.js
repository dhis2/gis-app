import * as types from '../constants/actionTypes';

export const openDataTable = (id) => ({
    type: types.DATA_TABLE_OPEN_REQUESTED,
    id,
});

export const closeDataTable = () => ({
    type: types.DATA_TABLE_CLOSE_REQUESTED,
});

export const resizeDataTable = (height) => ({
    type: types.DATA_TABLE_RESIZE,
    height,
});
