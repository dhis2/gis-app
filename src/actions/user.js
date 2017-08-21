import * as types from '../constants/actionTypes';
import { urlFetch } from '../util/api';
import { loading, loaded } from './loading';

export const setUser = (data) => ({
    type: types.USER_SET,
    payload: data,
});

// Load user
export const loadUser = () => (dispatch, getState) => {
    dispatch(loading());

    return urlFetch(getState().system.contextPath + '/api/me/user-account.json')
        .then(res => res.json())
        .then(data => {
            dispatch(setUser(data));
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};
