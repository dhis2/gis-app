import React from 'react';
import './FilterInput.css';

// http://adazzle.github.io/react-data-grid/examples.html#/custom-filters
// https://github.com/adazzle/react-data-grid/tree/master/packages/react-data-grid-addons/src/cells/headerCells/filters
const FilterInput = (props) => {
    const { layerId, type, dataKey, filters, setDataFilter, clearDataFilter } = props;
    const filterValue = filters[dataKey] || '';

    // https://stackoverflow.com/questions/36683770/react-how-to-get-the-value-of-an-input-field
    const onChange = (evt) => {
        const value = evt.target.value;

        if (value !== '') {
            setDataFilter(layerId, dataKey, value);
        } else {
            clearDataFilter(layerId, dataKey, value);
        }
    };

    return (
        <input
            className='FilterInput'
            placeholder={type === 'number' ? '3,5-15,>20' : 'Search'} // TODO: Support more field types
            value={filterValue}
            onClick={evt => evt.stopPropagation()}
            onChange={onChange}
        />
    )
};

export default FilterInput;
