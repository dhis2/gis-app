import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';

// Set all programs
export const setPrograms = (data) => ({
    type: types.PROGRAMS_SET,
    payload: data,
});

// Set program stages for one program
export const setProgramStages = (programId, payload) => ({
    type: types.PROGRAM_STAGES_SET,
    programId,
    payload,
});

// Set tracked entity attributes for one program
export const setProgramAttributes = (programId, payload) => ({
    type: types.PROGRAM_ATTRIBUTES_SET,
    programId,
    payload,
});

// Set data elements for one program stage
export const setProgramStageDataElements = (programStageId, payload) => ({
    type: types.PROGRAM_STAGE_DATA_ELEMENTS_SET,
    programStageId,
    payload,
});

// Load programs
export const loadPrograms = () => (dispatch) => {
    return apiFetch('programs.json?fields=id,displayName~rename(name)&paging=false')
        .then(data => dispatch(setPrograms(data.programs)));
};

// Load program stages
export const loadProgramStages = (programId) => (dispatch) =>
    apiFetch(`programs/${programId}.json?fields=programStages[id,displayName~rename(name)]&paging=false`)
        .then(data => dispatch(setProgramStages(programId, data.programStages)));

// Load program tracked entity attributes
export const loadProgramTrackedEntityAttributes = (programId) => (dispatch) =>
    apiFetch(`programs/${programId}.json?fields=programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType,optionSet[id,displayName~rename(name)]]]&paging=false`)
        .then(data => dispatch(setProgramAttributes(programId, arrayPluck(data.programTrackedEntityAttributes, 'trackedEntityAttribute'))));

// Load program stage data elements
export const loadProgramStageDataElements = (programStageId) => (dispatch) => {
    return apiFetch(`programStages/${programStageId}.json?fields=programStageDataElements[dataElement[id,${gis.init.namePropertyUrl},valueType,optionSet[id,displayName~rename(name)]]]`)
        .then(data => dispatch(setProgramStageDataElements(programStageId, arrayPluck(data.programStageDataElements, 'dataElement'))));
};
