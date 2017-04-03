import * as actionTypes from '../constants/actionTypes';

export const setMap = map => ({
    type: actionTypes.MAP_SET,
    payload: map
});

export const openContextMenu = (pos, feature) => {
    return {
        type: actionTypes.MAP_CONTEXT_MENU_OPEN,
        pos: pos,
        payload: feature,
    };
};

export const closeContextMenu = () => {
    console.log('close it');
    return {
        type: actionTypes.MAP_CONTEXT_MENU_CLOSE,
    };
};