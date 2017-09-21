import { combineEpics } from 'redux-observable';
import { getInstance as getD2 } from 'd2/lib/d2';
import 'rxjs/add/operator/concatMap';
import * as types from '../constants/actionTypes';
import { setPrograms, setProgramStages, setProgramAttributes, setProgramStageDataElements } from '../actions/programs';
import { errorActionCreator } from '../actions/helpers';

export const loadPrograms = (action$) =>
    action$
        .ofType(types.PROGRAMS_LOAD)
        .concatMap(() =>
            getD2()
                .then(d2 => d2.models.programs.list({
                    fields: 'id,displayName~rename(name)',
                    paging: false,
                }))
                .then(programs => setPrograms(programs.toArray()))
                .catch(errorActionCreator(types.PROGRAMS_LOAD_ERROR))
        );

// Load program stages
export const loadProgramStages = (action$) =>
    action$
        .ofType(types.PROGRAM_STAGES_LOAD)
        .concatMap((action) =>
            getD2()
                .then(d2 => d2.models.program.get(action.programId, {
                    fields: 'id,programStages[id,displayName~rename(name)]',
                    paging: false,
                }))
                .then(program => setProgramStages(action.programId, program.programStages.toArray()))
                .catch(errorActionCreator(types.PROGRAM_STAGES_LOAD_ERROR))
        );

// Load program tracked entity attributes - TODO: In use?
export const loadProgramTrackedEntityAttributes = (action$) =>
    action$
        .ofType(types.PROGRAM_ATTRIBUTES_LOAD)
        .concatMap((action) =>
            getD2()
                .then(d2 => d2.models.program.get(action.programId, {
                    fields: 'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType,optionSet[id,displayName~rename(name)]]]',
                    paging: false,
                }))
                .then(program => setProgramAttributes(action.programId, program.programTrackedEntityAttributes.toArray().map(d => d.trackedEntityAttribute)))
                .catch(errorActionCreator(types.PROGRAM_ATTRIBUTES_LOAD_ERROR))
        );

// Load program stage data elements
export const loadProgramStageDataElements = (action$) =>
    action$
        .ofType(types.PROGRAM_STAGE_DATA_ELEMENTS_LOAD)
        .concatMap((action) =>
            getD2()
                .then(d2 => d2.models.programStage.get(action.programStageId, {
                    fields: `programStageDataElements[dataElement[id,${gis.init.namePropertyUrl},valueType,optionSet[id,displayName~rename(name)]]]`,
                    paging: false,
                }))
                .then(programStage => setProgramStageDataElements(action.programStageId, programStage.programStageDataElements.map(d => d.dataElement)))
                .catch(errorActionCreator(types.PROGRAM_STAGE_DATA_ELEMENTS_LOAD_ERROR))
        );

export default combineEpics(loadPrograms, loadProgramStages, loadProgramTrackedEntityAttributes, loadProgramStageDataElements);
