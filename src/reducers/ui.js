import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    layersDialogOpen: false,
    favoritesDialogOpen: false,
};

const ui = (state = defaultState, action) => {
    switch (action.type) {

        case actionTypes.LAYERS_DIALOG_OPEN_REQUESTED:
            return {
                ...state,
                layersDialogOpen: true,
            };

        case actionTypes.LAYERS_DIALOG_CLOSE_REQUESTED:
            return {
                ...state,
                layersDialogOpen: false,
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