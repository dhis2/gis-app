import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import SelectField from '../d2-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const RelativePeriodsSelect = ({ periods = [], value, onChange, style }) => (
    <SelectField
        label='Period'
        items={periods}
        value={value}
        onChange={onChange}
        style={style}
    />
);

export default RelativePeriodsSelect;
