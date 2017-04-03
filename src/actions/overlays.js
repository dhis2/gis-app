import * as actionTypes from '../constants/actionTypes';
import { closeContextMenu } from './map';
import { loading, loaded } from './loading';
import { fetchOverlay } from '../loaders/overlays';

// Add new overlay
export const addOverlay = layer => ({
    type: actionTypes.OVERLAY_ADD,
    payload: layer,
});

// Edit overlay
export const editOverlay = layer => ({
    type: actionTypes.OVERLAY_EDIT,
    payload: layer
});

// Update existing overlay
export const updateOverlay = layer => ({
    type: actionTypes.OVERLAY_UPDATE,
    id: layer.id,
    payload: layer,
});

// Update existing overlay
export const requestOverlayLoad = id => ({
    type: actionTypes.OVERLAY_LOAD_REQUESTED,
    id: layer.id,
});

// Load overlay data
// http://redux.js.org/docs/advanced/AsyncActions.html
export function getOverlay(layer) {
    return dispatch => {
        dispatch(loading()); // Gives error: Warning: setState(...): Cannot update during an existing state transition

        // console.log('getOverlay', layer);

        return fetchOverlay(layer).then(layer => {
            //  console.log('LOADED', layer);

            if (layer.editCounter === 1) { // Add new layer
                dispatch(addOverlay(layer));
            } else { // Update existing layer
                dispatch(updateOverlay(layer));
            }

            dispatch(loaded());
        });
    }
}

// Remover an overlay
export const removeOverlay = id => ({
    type: actionTypes.OVERLAY_REMOVE,
    id,
});

// Expand/collapse overlay card
export const toggleOverlayExpand = id => ({
    type: actionTypes.OVERLAY_TOGGLE_EXPAND,
    id,
});

// Show/hide overlay on map
export const toggleOverlayVisibility = id => ({
    type: actionTypes.OVERLAY_TOGGLE_VISIBILITY,
    id,
});

// Set overlay opacity
export const changeOverlayOpacity = (id, opacity) => ({
    type: actionTypes.OVERLAY_CHANGE_OPACITY,
    id,
    opacity,
});

// Change ordering of overlays
export const sortOverlays = ({oldIndex, newIndex}) => ({
    type: actionTypes.OVERLAY_SORT,
    oldIndex,
    newIndex,
});

// Drill
export function drillOverlay(layerId, parentId, parentGraph, level) {
    return (dispatch, getState) => {
        dispatch(closeContextMenu());

        const dimConf = gis.conf.finals.dimension; // TODO
        const state = getState();
        const layer = state.map.overlays.filter(overlay => overlay.id === layerId)[0]; // TODO: Add check

        const overlay = {
            ...layer,
            rows: [{
                dimension: dimConf.organisationUnit.objectName,
                items: [
                    {id: parentId},
                    {id: 'LEVEL-' + level}
                ]
            }],
            parentGraphMap: {}
        };

        layer.parentGraphMap[parentId] = parentGraph;

        // console.log('DRILL', overlay);
        // dispatch(updateOverlay(overlay));

        dispatch(getOverlay(overlay));
    }
}

// Open overlay selection dialog
export const openOverlaysDialog = () => ({
    type: actionTypes.OVERLAYS_DIALOG_OPEN_REQUESTED,
});

// Close overlay selection dialog
export const closeOverlaysDialog = () => ({
    type: actionTypes.OVERLAYS_DIALOG_CLOSE_REQUESTED,
});