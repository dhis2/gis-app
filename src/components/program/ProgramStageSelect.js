import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';

export const ProgramStageSelect = ({ programStage, programStages, setProgramStage, style }) => (
    <SelectField
        label={i18next.t('Stage')}
        items={programStages}
        value={programStage ? programStage.id : null}
        onChange={setProgramStage}
        style={style}
    />
);


ProgramStageSelect.propTypes = {
    programStage: PropTypes.object,
    programStages: PropTypes.array,
    setProgramStage: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default ProgramStageSelect;
