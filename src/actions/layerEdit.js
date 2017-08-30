import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';
import { addOptionSet } from './optionSets';

export const setProgram = (program) => ({
    type: types.LAYER_EDIT_PROGRAM_SET,
    program,
});

export const setProgramStage = (programStage) => ({
    type: types.LAYER_EDIT_PROGRAM_STAGE_SET,
    programStage,
});

export const setStyleDataElement = (dataElement) => ({
    type: types.LAYER_EDIT_STYLE_DATA_ELEMENT_SET,
    dataElement,
});

export const loadStyleDataElement = (dataElement) => (dispatch, getState) => {
    const optionSet = dataElement.optionSet;

    // Add option set to data eleement
    if (optionSet && !optionSet.options) {
        // Check if option set is already loaded
        const cachedOptionSet = getState().optionSets[optionSet.id];

        if (cachedOptionSet) {
            dataElement.optionSet = cachedOptionSet;
            dispatch(setStyleDataElement(dataElement));
        } else {
            // TODO: Reuse function in actions/optionSets.js
            return apiFetch('optionSets.json?fields=id,displayName~rename(name),version,options[code,displayName~rename(name)]&paging=false&filter=id:eq:' + optionSet.id)
                .then(data => {
                    const optSet = data.optionSets[0];

                    dispatch(addOptionSet(optSet));
                    dataElement.optionSet = optSet;

                    // Temp
                    optSet.options[0].color = 'red';
                    optSet.options[1].color = 'black';

                    dispatch(setStyleDataElement(dataElement));

                    dispatch(loaded());
                });
        }
    }
};






/*
export const selectProgram = (program) => (dispatch, getState) => {
    dispatch(setProgram(program));
};

export const selectProgramStage = (programStage) => (dispatch, getState) => {
    dispatch(setProgramStage(programStage));
};
*/