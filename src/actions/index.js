import * as actionTypes from '../constants/actionTypes';


// Syntax: https://github.com/dhis2/dhis2-appstore/blob/feature/front-end/app/src/actions/actionCreators.js

// let nextOverlayId = 0;

/* MAP */
export const setMap = map => ({
    type: actionTypes.MAP_SET,
    payload: map
});

/* BASEMAPS */

export const basemapSelected = (id) => ({
    type: actionTypes.BASEMAP_SELECTED,
    id,
});

export const toggleBasemapExpand = () => ({
    type: actionTypes.BASEMAP_TOGGLE_EXPAND,
});

export const toggleBasemapVisibility = () => ({
    type: actionTypes.BASEMAP_TOGGLE_VISIBILITY,
});

export const changeBasemapOpacity = (opacity) => ({
    type: actionTypes.BASEMAP_CHANGE_OPACITY,
    opacity,
});








/* USER INTERFACE */



export const openDataTable = (id, data) => ({
    type: actionTypes.DATA_TABLE_OPEN_REQUESTED,
    id,
    data,
});

export const closeDataTable = () => ({
    type: actionTypes.DATA_TABLE_CLOSE_REQUESTED,
});
