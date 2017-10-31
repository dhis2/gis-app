import React from 'react';
import SelectField from 'd2-ui/lib/select-field/SelectField';

// TODO: Load on demand

const OrgUnitGroupSetSelect = (props) => (
    <SelectField
        label='Group set' // TODO: i18n
        style={{ marginRight: 24 }}
        {...props}
    />
);

export default OrgUnitGroupSetSelect;
