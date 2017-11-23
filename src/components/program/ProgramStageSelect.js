import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadProgramStages } from '../../actions/programs';
import { setProgramStage } from '../../actions/layerEdit';

export const ProgramStageSelect = ({ program, programStage, programStages, loadProgramStages, setProgramStage, style }) => {
    if (!programStages) {
        if (program) { // Load program stages on demand when program is selected
            loadProgramStages(program.id);
        }
        return null;
    }

    // Select first program stage if only one
    if (!programStage && programStages.length === 1) {
        setProgramStage(programStages[0]);
    }

    return (
        <SelectField
            label={i18next.t('Stage')}
            items={programStages}
            value={programStage ? programStage.id : null}
            onChange={setProgramStage}
            style={style}
        />
    );
};

ProgramStageSelect.propTypes = {
    program: PropTypes.object,
    programStage: PropTypes.object,
    programStages: PropTypes.array,
    loadProgramStages: PropTypes.func.isRequired,
    setProgramStage: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default connect(
    (state) => ({
        programStages: state.layerEdit.program ? state.programStages[state.layerEdit.program.id] : null,
        programStage: state.layerEdit.programStage,
        program:  state.layerEdit.program,
    }),
    { loadProgramStages, setProgramStage }
)(ProgramStageSelect);
