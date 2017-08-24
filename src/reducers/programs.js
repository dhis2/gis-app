import * as types from '../constants/actionTypes';

const programs = (state = [], action) => {

    switch (action.type) {
        case types.PROGRAMS_SET:
            return action.payload;

        case types.PROGRAM_STAGES_SET:
            return state.map(program =>
                (program.id === action.programId) ? { ...program, stages: action.payload } : program
            );

        case types.PROGRAM_ATTRIBUTES_SET:
            return state.map(program =>
                (program.id === action.programId) ? { ...program, attributes: action.payload } : program
            );

        default:
            return state;

    }
};

export default programs;
