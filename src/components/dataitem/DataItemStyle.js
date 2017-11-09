import React from 'react';
import BooleanStyle from './BooleanStyle';
import OptionSetStyle from '../../containers/OptionSetStyle';

const DataElementStyle = ({ id, valueType, name, optionSet }) => (
    <div>
        <span>{valueType}</span>
        {valueType === 'BOOLEAN' ? <BooleanStyle /> : null}
        {optionSet ? <OptionSetStyle {...optionSet} /> : null}
    </div>
);

export default DataElementStyle;
