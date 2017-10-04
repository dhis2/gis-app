import React from 'react';
import PropTypes from 'prop-types';
import MuiTextField from 'material-ui/TextField';

const NumberField = ({ label, value, onChange, style }) => (
    <MuiTextField
        floatingLabelText={label}
        type='number'
        value={typeof value !== 'undefined' ? value : ''}
        onChange={(event, value) => onChange(Number(value))}
        style={style}
    />
);

NumberField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default NumberField;
