import * as actionTypes from '../constants/actionTypes';

export const closeLayersPanel = (id) => ({
    type: actionTypes.LAYERS_PANEL_CLOSE_REQUESTED,
});

export const openLayersPanel = () => ({
    type: actionTypes.LAYERS_PANEL_OPEN_REQUESTED,
});