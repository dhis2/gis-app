import React from 'react';
import OptionSetStyle from '../../containers/OptionSetStyle';

const DataElementStyle = ({ optionSet }) => (
    <div>
        {optionSet ? <OptionSetStyle {...optionSet} /> : null}
    </div>
);

export default DataElementStyle;
