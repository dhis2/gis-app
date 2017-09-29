import React from 'react';
import SelectField from '../d2-ui/SelectField';

// TODO: Load on demand

const OrgUnitGroupSetSelect = (props) => (
    <SelectField
        label='Group set' // TODO: i18n
        style={{ marginRight: 24 }}
        {...props}
    />
);

export default OrgUnitGroupSetSelect;
