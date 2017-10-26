import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import SelectField from 'd2-ui/lib/select-field/SelectField';

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
