import * as actionTypes from '../constants/actionTypes';

const defaultState = {
    layersDialogOpen: false,
    favoriteDialogOpen: false,
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

        case actionTypes.FAVORITE_DIALOG_OPEN_REQUESTED:
            console.log('FAVORITE_DIALOG_OPEN_REQUESTED');

            return {
                ...state,
                favoriteDialogOpen: true,
            };

        case actionTypes.FAVORITE_DIALOG_CLOSE_REQUESTED:
            console.log('FAVORITE_DIALOG_CLOSE_REQUESTED');

            return {
                ...state,
                favoriteDialogOpen: false,
            };

        default:
            return state

    }
};

export default ui;