import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiSelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const SelectField = ({ label, items, value, onChange, style }) => (
    <MuiSelectField
        floatingLabelText={label}
        onChange={(event, index) => onChange(items[index])}
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
    </MuiSelectField>
);

SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    style: PropTypes.object,
};

export default SelectField;
