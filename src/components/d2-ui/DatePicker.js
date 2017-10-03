import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiDatePicker from 'material-ui/DatePicker';

const DatePicker = ({ label, value, onChange, style }) => (
    <MuiDatePicker
        floatingLabelText={label}
        onChange={(event, date) => onChange(date)}
        value={value}
        style={style}
    />
);

DatePicker.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default DatePicker;
