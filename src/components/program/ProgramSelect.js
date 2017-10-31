import React from 'react';
import SelectField from 'd2-ui/lib/select-field/SelectField';

const ProgramSelect = (props) => (
    <SelectField
        label='Program' // TODO: i18n
        style={{ marginRight: 24 }}
        {...props}
    />
);

export default ProgramSelect;
