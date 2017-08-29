import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';

export const setPrograms = (data) => ({
    type: types.PROGRAMS_SET,
    payload: data,
});

export const setProgramStages = (programId, payload) => ({
    type: types.PROGRAM_STAGES_SET,
    programId,
    payload,
});

export const setProgramAttributes = (programId, payload) => ({
    type: types.PROGRAM_ATTRIBUTES_SET,
    programId,
    payload,
});

export const setProgramStageDataElements = (programStageId, payload) => ({
    type: types.PROGRAM_STAGE_DATA_ELEMENTS_SET,
    programStageId,
    payload,
});

// Load programs
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

// Load program stages and tracked entity attributes
export const loadProgramStages = (programId) => (dispatch) => {
    dispatch(loading());

    return apiFetch('programs.json?filter=id:eq:' + programId + '&fields=programStages[id,displayName~rename(name)],programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType,optionSet[id,displayName~rename(name)]]]&paging=false')
        .then(res => res.json())
        .then(data => {
            const program = data.programs[0];

            if (!program) {
                // TODO: Error handling
            }

            dispatch(setProgramStages(programId, program.programStages));
            dispatch(setProgramAttributes(programId, arrayPluck(program.programTrackedEntityAttributes, 'trackedEntityAttribute')));

            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};

// Load program stage data elements
export const loadProgramStageDataElements = (programStageId) => (dispatch) => {
    dispatch(loading());

    return apiFetch('programStages.json?filter=id:eq:' + programStageId + '&fields=programStageDataElements[dataElement[id,' + gis.init.namePropertyUrl + ',valueType,optionSet[id,displayName~rename(name)]]]')
        .then(res => res.json())
        .then(data => {
            const objects = data.programStages;

            if (data.programStages.length) {
                const dataElements = arrayPluck(data.programStages[0].programStageDataElements, 'dataElement');

                dispatch(setProgramStageDataElements(programStageId, dataElements));
            }
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};
