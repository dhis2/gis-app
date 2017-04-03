import * as actionTypes from '../constants/actionTypes';

const contextMenu = (state = null, action) => {
    switch (action.type) {

        case actionTypes.MAP_CONTEXT_MENU_OPEN:
            console.log('MAP_CONTEXT_MENU_OPEN', action);

            return {
                pos: action.pos,
                feature: action.payload,
            };

        case actionTypes.MAP_CONTEXT_MENU_CLOSE:
            console.log('MAP_CONTEXT_MENU_CLOSE', action);

            return null;


        default:
            return state;

    }
};

export default contextMenu;

