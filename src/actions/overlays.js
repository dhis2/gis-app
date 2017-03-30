import * as actionTypes from '../constants/actionTypes';
import { loading, loaded } from './loading';
import { fetchOverlay } from '../loaders/overlays';

// Add new overlay
export const addOverlay = (layer) => ({
    type: actionTypes.OVERLAY_ADD,
    payload: layer,
});

// Edit overlay
export const editOverlay = layer => ({
    type: actionTypes.OVERLAY_EDIT,
    payload: layer
});

// Update existing overlay
export const updateOverlay = (layer) => ({
    type: actionTypes.OVERLAY_UPDATE,
    id: layer.id,
    payload: layer,
});

// Update existing overlay
export const requestOverlayLoad = (id) => ({
    type: actionTypes.OVERLAY_LOAD_REQUESTED,
    id: layer.id,
});

// http://redux.js.org/docs/advanced/AsyncActions.html
export function getOverlay(layer) {
    return dispatch => {
        // dispatch(loading()); Gives error: Warning: setState(...): Cannot update during an existing state transition

        return fetchOverlay(layer).then(layer => {
            if (layer.editCounter === 1) { // Add new layer
                dispatch(addOverlay(layer));
            } else { // Update existing layer
                dispatch(updateOverlay(layer));
            }

            dispatch(loaded());
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


export const openOverlaysDialog = () => ({
    type: actionTypes.OVERLAYS_DIALOG_OPEN_REQUESTED,
});

export const closeOverlaysDialog = () => ({
    type: actionTypes.OVERLAYS_DIALOG_CLOSE_REQUESTED,
});