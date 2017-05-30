import React from 'react';
import './FilterInput.css';

//
// http://adazzle.github.io/react-data-grid/examples.html#/custom-filters
const FilterInput = ({ type }) => {

    return (
        <input
            className='FilterInput'
            placeholder={type === 'number' ? '3,5-15,>20' : 'Search'} // TODO: Support more field types
            onClick={evt => evt.stopPropagation()}
        />
    )
};

export default FilterInput;
