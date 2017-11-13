import React from 'react';
import BooleanStyle from './BooleanStyle';
import OptionSetStyle from '../../containers/OptionSetStyle';
import NumberStyle from '../style/NumberStyle';

const style = {
    marginTop: -24,
};

const DataElementStyle = ({ id, valueType, name, optionSet }) => (
    <div style={style}>
        {valueType === 'INTEGER' ? <NumberStyle /> : null}
        {valueType === 'BOOLEAN' ? <BooleanStyle /> : null}
        {optionSet ? <OptionSetStyle {...optionSet} /> : null}
    </div>
);

export default DataElementStyle;
