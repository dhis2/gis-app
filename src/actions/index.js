import * as actionTypes from '../constants/actionTypes';
import loadLayer from '../loaders/loadLayer';

// Syntax: https://github.com/dhis2/dhis2-appstore/blob/feature/front-end/app/src/actions/actionCreators.js


// let nextOverlayId = 0;

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


/* OVERLAYS */

// Edit overlay
export const editOverlay = layer => ({
    type: actionTypes.OVERLAY_EDIT,
    payload: layer
});

/*
export const addOverlay = layer => ({
    type: actionTypes.OVERLAY_ADD,
    payload: {
        id: 'overlay-' + nextOverlayId++,
        ...layer,
    },
});
*/

// Add new overlay
export const addOverlay = layer => ({
    type: actionTypes.OVERLAY_ADD,
    payload: layer,
});

// Update existing overlay
export const updateOverlay = layer => ({
    type: actionTypes.OVERLAY_UPDATE,
    payload: layer,
});

// Loading overlay data
export const loadOverlay = id => ({
    type: actionTypes.OVERLAY_LOAD,
    id,
});

// http://redux.js.org/docs/advanced/AsyncActions.html
export function loadOverlay(layer) {
    return function (dispatch) {
        // dispatch ...

        loadLayer(layer, () => {
            if (!layer.id) { // Add new layer
                dispatch(addOverlay(layer));
            } else { // Update existing layer
                dispatch(updateOverlay(layer));
            }
        });
    }
}



export const removeOverlay = (id) => ({
    type: actionTypes.OVERLAY_REMOVE,
    id,
});

export const toggleOverlayExpand = (id) => ({
    type: actionTypes.OVERLAY_TOGGLE_EXPAND,
    id,
});

export const toggleOverlayVisibility = (id) => ({
    type: actionTypes.OVERLAY_TOGGLE_VISIBILITY,
    id,
});

export const changeOverlayOpacity = (id, opacity) => ({
    type: actionTypes.OVERLAY_CHANGE_OPACITY,
    id,
    opacity,
});

export const sortOverlays = ({oldIndex, newIndex}) => ({
    type: actionTypes.OVERLAY_SORT,
    oldIndex,
    newIndex,
});



/* USER INTERFACE */

export const openLayersDialog = () => ({
    type: actionTypes.LAYERS_DIALOG_OPEN_REQUESTED,
});

export const closeLayersDialog = () => ({
    type: actionTypes.LAYERS_DIALOG_CLOSE_REQUESTED,
});

export const openDataTable = (id, data) => ({
    type: actionTypes.DATA_TABLE_OPEN_REQUESTED,
    id,
    data,
});

export const closeDataTable = () => ({
    type: actionTypes.DATA_TABLE_CLOSE_REQUESTED,
});
