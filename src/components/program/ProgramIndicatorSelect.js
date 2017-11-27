import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';

export const ProgramIndicatorSelect = ({ programIndicator, programIndicator, setProgramSIndicator, style }) => (
    <SelectField
        label={i18next.t('Stage')}
        items={programIndicators}
        value={programIndicator ? programIndicator.id : null}
        onChange={setProgramIndicator}
        style={style}
    />
);

ProgramIndicatorSelect.propTypes = {
    programIndicator: PropTypes.object,
    programIndicators: PropTypes.array,
    setProgramIndicator: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default ProgramIndicatorSelect;
