const defaultState = {
    layersDialogOpen: false,
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

        default:
            return state

    }
};

export default ui;