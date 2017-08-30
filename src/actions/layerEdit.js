import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { addOptionSet, getOptionSet } from './optionSets';

// Set program used
export const setProgram = (program) => ({
    type: types.LAYER_EDIT_PROGRAM_SET,
    program,
});

// Set program stage used
export const setProgramStage = (programStage) => ({
    type: types.LAYER_EDIT_PROGRAM_STAGE_SET,
    programStage,
});

// Set data element used for styling
export const setStyleDataElement = (dataElement) => ({
    type: types.LAYER_EDIT_STYLE_DATA_ELEMENT_SET,
    dataElement,
});

// Set options for style data element with option set (options are loaded separately)
export const setStyleOptions = (options) => ({
    type: types.LAYER_EDIT_STYLE_DATA_ELEMENT_OPTIONS_SET,
    options,
});
