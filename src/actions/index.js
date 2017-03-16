import * as actions from '../constants/actionTypes';
import loadLayer from '../loaders/loadLayer';

// Syntax: https://github.com/dhis2/dhis2-appstore/blob/feature/front-end/app/src/actions/actionCreators.js


let nextOverlayId = 0;

/* BASEMAPS */

export const basemapSelected = (id) => ({
    type: 'BASEMAP_SELECTED',
    id,
});

export const toggleBasemapExpand = () => ({
    type: 'BASEMAP_TOGGLE_EXPAND',
});

export const toggleBasemapVisibility = () => ({
    type: 'BASEMAP_TOGGLE_VISIBILITY',
});

export const changeBasemapOpacity = (opacity) => ({
    type: 'BASEMAP_CHANGE_OPACITY',
    opacity,
});


/* OVERLAYS */

export const editOverlay = layer => ({
    type: actions.OVERLAY_EDIT,
    payload: { // Creating a copy as the same overlay can be added more than once
        ...layer,
    },
});

export const addOverlay = layer => ({
    type: actions.OVERLAY_ADD,
    payload: {
        id: 'overlay-' + nextOverlayId++,
        ...layer,
    },
});

export const updateOverlay = (layer) => ({
    type: actions.OVERLAY_UPDATE,
    payload: layer,
});

/*
export const loadOverlay = (layer) => ({
    ...layer,
    type: 'OVERLAY_LOAD',
});
*/

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
    type: 'OVERLAY_REMOVE',
    id,
});

export const toggleOverlayExpand = (id) => ({
    type: 'OVERLAY_TOGGLE_EXPAND',
    id,
});

export const toggleOverlayVisibility = (id) => ({
    type: 'OVERLAY_TOGGLE_VISIBILITY',
    id,
});

export const changeOverlayOpacity = (id, opacity) => ({
    type: 'OVERLAY_CHANGE_OPACITY',
    id,
    opacity,
});

export const sortOverlays = ({oldIndex, newIndex}) => ({
    type: 'OVERLAY_SORT',
    oldIndex,
    newIndex,
});



/* USER INTERFACE */

export const openLayersDialog = () => ({
    type: 'LAYERS_DIALOG_OPEN_REQUESTED',
});

export const closeLayersDialog = () => ({
    type: 'LAYERS_DIALOG_CLOSE_REQUESTED',
});

export const openDataTable = (id, data) => ({
    type: 'DATA_TABLE_OPEN_REQUESTED',
    id,
    data,
});

export const closeDataTable = () => ({
    type: 'DATA_TABLE_CLOSE_REQUESTED',
});
