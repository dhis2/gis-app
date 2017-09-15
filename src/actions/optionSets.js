import * as types from '../constants/actionTypes';
import { getInstance as getD2 } from 'd2/lib/d2';

export const addOptionSet = (data) => ({
    type: types.OPTION_SET_ADD,
    payload: data,
});

// Load option set
export const loadOptionSet = (id) => (dispatch) =>
  getD2()
    .then(d2 => d2.models.optionSets.get(id, {
      fields: 'id,displayName~rename(name),version,options[code,displayName~rename(name)]',
      paging: false,
    }))
    .then(optionSet => dispatch(addOptionSet(optionSet)));
