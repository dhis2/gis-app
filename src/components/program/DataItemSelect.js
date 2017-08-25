import React from 'react';
import SelectField from '../d2-ui/SelectField';

const DataItemSelect = (props) => (
    <SelectField
        label='Style by data item' // TODO: i18n
        {...props}
    />
);

export default DataItemSelect;
