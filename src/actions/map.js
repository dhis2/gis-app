import * as actionTypes from '../constants/actionTypes';

export const setMap = map => ({
    type: actionTypes.MAP_SET,
    payload: map,
});

export const openCoordinatePopup = coord => ({
    type: actionTypes.MAP_COORDINATE_OPEN,
    payload: coord,
});

export const closeCoordinatePopup = coord => ({
    type: actionTypes.MAP_COORDINATE_CLOSE,
});

export const openContextMenu = payload => {
    return {
        type: actionTypes.MAP_CONTEXT_MENU_OPEN,
        payload,
    };
};

export const closeContextMenu = () => {
    return {
        type: actionTypes.MAP_CONTEXT_MENU_CLOSE,
    };
};