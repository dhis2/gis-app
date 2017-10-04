import React from 'react';
import NumberField from '../d2-ui/NumberField';

const style = {
    marginRight: 16,
    width: 216,
    top: -15,
};

const DataItemValue = ({}) => (
    <NumberField
        label='Value' // TODO: i18n
        onChange={(value) => console.log(value)}
        style={style}
    />
);

export default DataItemValue;
