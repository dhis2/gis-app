import React from 'react';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';

const ProgramStageSelect = (props) => (
    <SelectField
        label={i18next.t('Stage')}
        {...props}
    />
);

export default ProgramStageSelect;
