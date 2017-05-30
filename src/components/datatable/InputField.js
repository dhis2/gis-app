import React from 'react';
import './InputField.css';

const InputField = ({ type }) => (
    <input className='InputField'
        defaultValue={type === 'number' ? '3,5-15,>20' : 'Search'} // TODO: Support more field types
    />
);

export default InputField;
