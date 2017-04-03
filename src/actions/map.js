import * as actionTypes from '../constants/actionTypes';

export const setMap = map => ({
    type: actionTypes.MAP_SET,
    payload: map
});

export const openContextMenu = (pos, layerId, feature) => {
    return {
        type: actionTypes.MAP_CONTEXT_MENU_OPEN,
        pos,
        layerId,
        feature,
    };
};

export const closeContextMenu = () => {
    return {
        type: actionTypes.MAP_CONTEXT_MENU_CLOSE,
    };
};