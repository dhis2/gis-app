import React from 'react';
import OptionSet from './OptionSet';

const DataElement = (props) => {
    const { optionSet, onChange } = props;

    return (
        <div>
            {optionSet ? <OptionSet {...optionSet} onChange={onChange} /> : null}
        </div>
    );
};

export default DataElement;
