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

export const setProgramStageDataElements = (programId, programStageId, payload) => ({
    type: types.PROGRAM_STAGE_DATA_ELEMENTS_SET,
    programId,
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

// Load program stages
export const loadProgramStages = (programId) => (dispatch) => {
    dispatch(loading());

    return apiFetch('programs.json?filter=id:eq:' + programId + '&fields=programStages[id,displayName~rename(name)],programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType,optionSet[id,displayName~rename(name)]]]&paging=false')
        .then(res => res.json())
        .then(data => {
            const program = data.programs[0];

            if (!program) {
                // TODO: Error handling
            }

            const stages = program.programStages;
            const attributes = arrayPluck(program.programTrackedEntityAttributes, 'trackedEntityAttribute');

            // Mark as attribute
            attributes.forEach(attribute => attribute.isAttribute = true); // TODO: Needed?

            dispatch(setProgramStages(programId, stages));
            dispatch(setProgramAttributes(programId, attributes));

            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};

// Load program stage data elements
export const loadProgramStageDataElements = (programId, programStageId) => (dispatch) => {
    dispatch(loading());

    return apiFetch('programStages.json?filter=id:eq:' + programStageId + '&fields=programStageDataElements[dataElement[id,' + gis.init.namePropertyUrl + ',valueType,optionSet[id,displayName~rename(name)]]]')
        .then(res => res.json())
        .then(data => {
            const objects = data.programStages;

            if (data.programStages.length) {
                const dataElements = arrayPluck(data.programStages[0].programStageDataElements, 'dataElement');

                dispatch(setProgramStageDataElements(programId, programStageId, dataElements));
            }
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};