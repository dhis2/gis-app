import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';
import { getInstance as getD2 } from 'd2/lib/d2';


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
    getD2()
        .then(d2 => d2.models.programs.list({
            fields: 'id,displayName~rename(name)',
            paging: false,
        }))
        .then(programs => dispatch(setPrograms(programs.toArray())));
};

// Load program stages
export const loadProgramStages = (programId) => (dispatch) =>
  getD2()
    .then(d2 => d2.models.program.get(programId, {
      fields: 'id,programStages[id,displayName~rename(name)]',
      paging: false,
    }))
    .then(program => dispatch(setProgramStages(programId, program.programStages.toArray())));

// Load program tracked entity attributes - TODO: In use?
export const loadProgramTrackedEntityAttributes = (programId) => (dispatch) =>
  getD2()
    .then(d2 => d2.models.program.get(programId, {
      fields: 'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType,optionSet[id,displayName~rename(name)]]]',
      paging: false,
    }))
    .then(program => dispatch(setProgramAttributes(programId, arrayPluck(program.programTrackedEntityAttributes.toArray(), 'trackedEntityAttribute'))));

// Load program stage data elements
export const loadProgramStageDataElements = (programStageId) => (dispatch) =>
  getD2()
    .then(d2 => d2.models.programStage.get(programStageId, {
      fields: 'programStageDataElements[dataElement[id,${gis.init.namePropertyUrl},valueType,optionSet[id,displayName~rename(name)]]]',
      paging: false,
    }))
    .then(programStage => dispatch(setProgramStageDataElements(programStageId, arrayPluck(programStage.programStageDataElements, 'dataElement'))));
