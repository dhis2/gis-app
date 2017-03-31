import * as actionTypes from '../constants/actionTypes';
import { setMap } from '.';
import { loading, loaded } from './loading';
import { fetchFavorite, parseFavorite } from '../loaders/favorites';
import { getOverlay } from './overlays';

export function getFavorite(id) {
    return dispatch => {
        dispatch(loading());

        return fetchFavorite(id).then(favorite => {
            const mapConfig = parseFavorite(favorite);

            dispatch(setMap(mapConfig));

            // Trigger loading of all overlays
            mapConfig.overlays.forEach(overlay => dispatch(getOverlay(overlay)));

            dispatch(loaded()); // TODO: Dispatch after all overlays are loaded

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



