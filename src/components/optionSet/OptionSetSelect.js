import React from 'react';
import SelectField from 'd2-ui/lib/select-field/SelectField';

const style = {
    marginTop: -8,
    marginRight: 16,
    width: 216,
    float: 'left',
};

const OptionSetSelect = ({ options, value, onChange }) => {
    // console.log('OptionSetSelect', options);

    return (
        <SelectField
            label='Options' // TODO: i18n
            items={options.map(option => ({ id: option.code, name: option.name }))}
            value={value}
            multiple={true}
            onChange={values => onChange(values)}
            style={style}
        />
    );
};

export default OptionSetSelect;
