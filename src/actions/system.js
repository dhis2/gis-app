import * as types from '../constants/actionTypes';
import { apiFetch, urlFetch } from '../util/api';
import { loadUser } from './user';
import { loading, loaded } from './loading';

export const setSystemData = (data) => ({
    type: types.SYSTEM_DATA_SET,
    payload: data,
});

// Load system info
export const loadSystemInfo = () => (dispatch, getState) => {
    dispatch(loading());

    return apiFetch('system/info.json')
        .then(res => res.json())
        .then(data => {
            dispatch(setSystemData(data));
            dispatch(loadUser());
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};

// Load system settings
export const loadSystemSettings = () => (dispatch) => {
    dispatch(loading());

    return apiFetch('systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyGoogleMapsApiKey&key=keyMapzenSearchApiKey')
        .then(res => res.json())
        .then(data => {
            dispatch(setSystemData(data));
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};
