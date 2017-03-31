import * as actionTypes from '../constants/actionTypes';

export default function loading(state = false, action) {
    switch (action.type) {
        case actionTypes.LOADING:
            return true;
        case actionTypes.LOADED:
            return false;
        default:
            return state;
    }
}