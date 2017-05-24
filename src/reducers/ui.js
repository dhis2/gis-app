import * as types from '../constants/actionTypes';

const defaultState = {
    width: typeof window === 'object' ? window.innerWidth : null,
    height: typeof window === 'object' ? window.innerHeight : null,
    layersPanelOpen: true,
    dataTableOpen: false,
    dataTableHeight: 200,
    overlaysDialogOpen: false,
    favoritesDialogOpen: false,
    mapContextMenu: true,
};

const ui = (state = defaultState, action) => {
    switch (action.type) {

        case types.SCREEN_RESIZE:
            return {
                ...state,
                width: action.width,
                height: action.height,
            };

        case types.LAYERS_PANEL_OPEN_REQUESTED:
            return {
                ...state,
                layersPanelOpen: true,
            };

        case types.LAYERS_PANEL_CLOSE_REQUESTED:
            return {
                ...state,
                layersPanelOpen: false,
            };

        case 'DATA_TABLE_OPEN_REQUESTED':
            return {
                ...state,
                dataTableOpen: true,
            };

        case 'DATA_TABLE_CLOSE_REQUESTED':
            return {
                ...state,
                dataTableOpen: false,
            };

        case types.OVERLAYS_DIALOG_OPEN_REQUESTED:
            return {
                ...state,
                overlaysDialogOpen: true,
            };

        case types.OVERLAYS_DIALOG_CLOSE_REQUESTED:
            return {
                ...state,
                overlaysDialogOpen: false,
            };

        case types.FAVORITES_DIALOG_OPEN_REQUESTED:
            return {
                ...state,
                favoritesDialogOpen: true,
            };

        case types.FAVORITES_DIALOG_CLOSE_REQUESTED:
            return {
                ...state,
                favoritesDialogOpen: false,
            };

        case types.DATA_TABLE_RESIZE:
            return {
                ...state,
                dataTableHeight: action.height,
            };

        default:
            return state

    }
};

export default ui;