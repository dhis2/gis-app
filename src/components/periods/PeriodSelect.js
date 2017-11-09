import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import RelativePeriodsSelect from '../../containers/RelativePeriodsSelect';
import DatePicker from '../d2-ui/DatePicker';

const styles = {
    container: {
        // flex: '2 auto',
        display: 'flex',
        // margin: '0 -12px',
        // margin: -12,
        width: '100%',
        // height: 74,
        // marginTop: -20,
        background: 'yellow',

    },
    periods: {
        flex: 2,
        background: 'green',
        // margin: 12,

        flexGrow: 2,
        margin: '0 12px',
        // float: 'left',
        // marginRight: 24,

    },
    dates: {
        // float: 'left',
        background: 'red'
    },
    datePicker: {
        // width: 120,
        // float: 'left',
        flex: 1,
        flexGrow: 1,
        // marginRight: 24,
    },
    dateField: {
        width: 112,
    },
};

console.log('React', React)

const PeriodSelect = ({ period, startDate, endDate, setRelativePeriod, setStartDate, setEndDate }) =>
    [
        <RelativePeriodsSelect
            key='period'
            value={period ? period : 'START_END_DATES'}
            onChange={setRelativePeriod}
            style={styles.periods}
        />
    ].concat(!period ? [
        <DatePicker
            key='startdate'
            label={i18next.t('Start date')}
            value={startDate}
            onChange={setStartDate}
            style={styles.datePicker}
            textFieldStyle={styles.dateField}
        />,
        <DatePicker
            key='enddate'
            label={i18next.t('End date')}
            value={endDate}
            onChange={setEndDate}
            style={styles.datePicker}
            textFieldStyle={styles.dateField}
        />
      ]
    : []);

PeriodSelect.contextTypes = {
    d2: PropTypes.object
};

 PeriodSelect.propTypes = {
    period: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    setRelativePeriod: PropTypes.func.isRequired,
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
};

export default PeriodSelect;
