import React from 'react';
import InputField from './InputField';
import './ColumnHeader.css';

const ColumnHeader = ({ type, label }) => (
    <div className="ColumnHeader">
        <span>{label}</span>
        <InputField
            type={type}
        />
    </div>
);

export default ColumnHeader;
