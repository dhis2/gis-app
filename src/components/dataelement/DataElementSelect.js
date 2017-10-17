import React from 'react';
import SelectField from '../d2-ui/SelectField';

const style = {
    marginTop: -8,
    marginRight: 24,
};

const DataElementSelect = (props) => (
    <SelectField
        // label='Style by data item' // TODO: i18n
        style={style}
        {...props}
    />
);

export default DataElementSelect;
