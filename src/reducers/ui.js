import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    overlaysDialogOpen: false,
    favoritesDialogOpen: false,
    mapContextMenu: true,
};

const ui = (state = defaultState, action) => {
    switch (action.type) {

        case actionTypes.OVERLAYS_DIALOG_OPEN_REQUESTED:
            return {
                ...state,
                overlaysDialogOpen: true,
            };

        case actionTypes.OVERLAYS_DIALOG_CLOSE_REQUESTED:
            return {
                ...state,
                overlaysDialogOpen: false,
            };

        case actionTypes.FAVORITES_DIALOG_OPEN_REQUESTED:
            return {
                ...state,
                favoritesDialogOpen: true,
            };

        case actionTypes.FAVORITES_DIALOG_CLOSE_REQUESTED:
            return {
                ...state,
                favoritesDialogOpen: false,
            };

        default:
            return state

    }
};

export default ui;