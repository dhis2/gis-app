import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadPrograms } from '../../actions/programs';
import { setProgram } from '../../actions/layerEdit';

export const ProgramSelect = ({ programs, program, loadPrograms, setProgram, style }) => {
    if (!programs) {
        loadPrograms();
        return null;
    }

    return (
        <SelectField
            label={i18next.t('Program')}
            items={programs}
            value={program ? program.id : null}
            onChange={setProgram}
            style={style}
        />
    );
};

ProgramSelect.propTypes = {
    programs: PropTypes.array,
    program: PropTypes.object,
    loadPrograms: PropTypes.func.isRequired,
    setProgram: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default connect(
    (state) => ({
        programs: state.programs,
        program: state.layerEdit.program,
    }),
    { loadPrograms, setProgram }
)(ProgramSelect);
