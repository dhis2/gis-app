import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';


export const addOptionSet = (data) => ({
    type: types.OPTION_SET_ADD,
    payload: data,
});

// Load option set
export const loadOptionSet = (id) => (dispatch) => {
    dispatch(loading());

    return apiFetch('optionSets.json?fields=id,displayName~rename(name),version,options[code,displayName~rename(name)]&paging=false&filter=id:eq:' + id)
        .then(res => res.json())
        .then(data => {
            dispatch(addOptionSet(data.optionSets[0]));
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};


