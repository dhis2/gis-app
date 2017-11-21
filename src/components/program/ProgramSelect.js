import React from 'react';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';

const ProgramSelect = (props) => (
    <SelectField
        label={i18next.t('Program')}
        style={{ marginRight: 24 }}
        {...props}
    />
);

export default ProgramSelect;
