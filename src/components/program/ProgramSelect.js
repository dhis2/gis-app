import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';

export const ProgramSelect = ({ programs = [], program, setProgram, style }) => (
    <SelectField
        label={i18next.t('Program')}
        items={programs}
        value={program ? program.id : null}
        onChange={setProgram}
        style={style}
    />
);

ProgramSelect.propTypes = {
    programs: PropTypes.array,
    program: PropTypes.object,
    setProgram: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default ProgramSelect;
