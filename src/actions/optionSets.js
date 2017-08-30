import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';


export const addOptionSet = (data) => ({
    type: types.OPTION_SET_ADD,
    payload: data,
});

// Load option set
export const loadOptionSet = (id) => (dispatch) =>
    apiFetch(`optionSets/${id}.json?fields=id,displayName~rename(name),version,options[code,displayName~rename(name)]&paging=false`)
        .then(data => console.log(data));
        // .then(data => dispatch(addOptionSet(data.optionSets[0])));



