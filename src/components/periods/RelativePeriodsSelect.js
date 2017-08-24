import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const RelativePeriodsSelect = ({ periods = [], value, onChange }) => (
    <SelectField
        floatingLabelText='Period'
        onChange={(event, index, value) => onChange(value)}
        value={value}
        style={{ marginRight: 24 }}
    >
        {periods.map(period => (
            <MenuItem
                key={period.id}
                value={period.id}
                primaryText={period.name}
            />
        ))}
    </SelectField>
);

export default RelativePeriodsSelect;
