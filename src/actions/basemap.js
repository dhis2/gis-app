import * as actionTypes from '../constants/actionTypes';

export const selectBasemap = id => ({
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