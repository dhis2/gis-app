import React from 'react';
import SelectField from '../d2-ui/SelectField';

const style = {
    marginTop: -8,
    marginRight: 24,
    width: 120,
};

const DataItemOperator = ({}) => {
   return (
        <SelectField
            label='Operator' // TODO: i18n
            onChange={() => {}}
            style={style}
            items={[]}
        />
    )
};

export default DataItemOperator;
