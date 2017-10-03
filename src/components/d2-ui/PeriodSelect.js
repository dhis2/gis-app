import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelativePeriodsSelect from '../../containers/RelativePeriodsSelect';
import DatePicker from '../d2-ui/DatePicker';

const PeriodSelect = ({ period, startDate, endDate, setRelativePeriod, setStartDate, setEndDate }) => (
    <div>
        <RelativePeriodsSelect
            value={period ? period.items[0].id : null}
            onChange={setRelativePeriod}
        />
        <DatePicker
            label='Start date'
            value={startDate}
            onChange={setStartDate}
        />
        <DatePicker
            label='End date'
            value={endDate}
            onChange={setEndDate}
        />
    </div>
);

/*
PeriodSelect.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
};
*/

export default PeriodSelect;
