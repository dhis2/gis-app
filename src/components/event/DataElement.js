import React from 'react';
import OptionSet from './OptionSet';

const DataElement = (props) => {
    const { optionSet } = props;

    return (
        <div>
            {optionSet ? <OptionSet {...optionSet} /> : null}
        </div>
    );
};

export default DataElement;
