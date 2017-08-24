import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const D2SelectField = ({ label, items, value, onChange, style }) => (
    <SelectField
        floatingLabelText={label}
        onChange={(event, index, value) => onChange(value)}
        value={value}
        style={style}
    >
        {items.map(item => (
            <MenuItem
                key={item.id}
                value={item.id}
                primaryText={item.name}
            />
        ))}
    </SelectField>
);

D2SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    style: PropTypes.object,
};

export default D2SelectField;
