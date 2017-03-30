import * as actionTypes from '../constants/actionTypes';
import { setMap } from '.';
import { loading, loaded } from './loading';
import { fetchFavorite, parseFavorite } from '../loaders/favorites';

export function getFavorite(id) {
    return dispatch => {
        dispatch(loading());

        return fetchFavorite(id).then(favorite => {
            dispatch(setMap(parseFavorite(favorite)));
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
    }
}

export const openFavoritesDialog = () => ({
    type: actionTypes.FAVORITES_DIALOG_OPEN_REQUESTED,
});

export const closeFavoritesDialog = () => ({
    type: actionTypes.FAVORITES_DIALOG_CLOSE_REQUESTED,
});



