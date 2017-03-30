import * as actionTypes from '../constants/actionTypes';

export function loading() {
    return {
        type: actionTypes.LOADING
    };
}

export function loaded() {
    return {
        type: actionTypes.LOADED
    };
}