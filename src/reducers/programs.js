import * as types from '../constants/actionTypes';

const programs = (state = [], action) => {

    switch (action.type) {
        case types.PROGRAMS_SET:
            return action.payload;

        // Set stages for program
        case types.PROGRAM_STAGES_SET:
            return state.map(program =>
                (program.id === action.programId) ? {
                    ...program,
                    stages: action.payload
                } : program
            );

        // Set attributes for program
        case types.PROGRAM_ATTRIBUTES_SET:
            return state.map(program =>
                (program.id === action.programId) ? {
                    ...program,
                    attributes: action.payload
                } : program
            );

        // Set data elements for stage under program
        case types.PROGRAM_STAGE_DATA_ELEMENTS_SET:
            return state.map(program =>
                (program.id === action.programId) ? {
                    ...program,
                    stages: program.stages.map(stage =>
                        stage.id === action.programStageId ? {
                            ...stage,
                            dataElements: action.payload
                        } : stage)
                } : program
            );

        default:
            return state;

    }
};

export default programs;
