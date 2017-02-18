const defaultState = {
    layersDialogOpen: false,
    dataTableOpen: true,
};

const ui = (state = defaultState, action) => {

    switch (action.type) {

        case 'LAYERS_DIALOG_OPEN_REQUESTED':
            return {
                ...state,
                layersDialogOpen: true,
            };

        case 'LAYERS_DIALOG_CLOSE_REQUESTED':
            return {
                ...state,
                layersDialogOpen: false,
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

        default:
            return state

    }
};

export default ui;