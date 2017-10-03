import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import SelectField from '../d2-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const RelativePeriodsSelect = ({ periods = [], value, onChange }) => (
    <SelectField
        label='Period'
        items={periods}
        value={value}
        onChange={onChange}
        style={{ marginRight: 24 }}
    />
);

export default RelativePeriodsSelect;
