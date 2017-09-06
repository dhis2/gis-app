import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';

const D2NumberField = ({ label, value, onChange, style }) => (
    <TextField
        floatingLabelText={label}
        type='number'
        value={value}
        onChange={(event, value) => onChange(Number(value))}
        style={style}
    />
);

D2NumberField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default D2NumberField;
