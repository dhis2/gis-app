import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';

export const setPrograms = (data) => ({
    type: types.PROGRAMS_SET,
    payload: data,
});

// Load system info
export const loadPrograms = () => (dispatch) => {
    dispatch(loading());

    return apiFetch('programs.json?fields=id,displayName~rename(name)&paging=false')
        .then(res => res.json())
        .then(data => {
            dispatch(setPrograms(data.programs));
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};