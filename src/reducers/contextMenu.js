import * as actionTypes from '../constants/actionTypes';

const contextMenu = (state = null, action) => {
    switch (action.type) {

        case actionTypes.MAP_CONTEXT_MENU_OPEN:
            return {
                pos: action.pos,
                layerId: action.layerId,
                feature: action.feature,
            };

        case actionTypes.MAP_CONTEXT_MENU_CLOSE:
            return null;

        default:
            return state;

    }
};

export default contextMenu;

