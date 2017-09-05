import React from 'react';
import OptionSetStyle from '../../containers/OptionSetStyle';

const DataItemStyle = ({ optionSet }) => (
    <div>
        {optionSet ? <OptionSetStyle {...optionSet} /> : null}
    </div>
);

export default DataItemStyle;
