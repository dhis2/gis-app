import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import RelativePeriodsSelect from '../../containers/RelativePeriodsSelect';
import DatePicker from '../d2-ui/DatePicker';

const styles = {
    container: {
        width: '100%',
        height: 74,
    },
    periods: {
        float: 'left',
        marginRight: 24,

    },
    dates: {
        float: 'left',
    },
    datePicker: {
        width: 120,
        float: 'left',
        marginRight: 24,
    },
    dateField: {
        width: 112,
    },
};

const PeriodSelect = ({ period, startDate, endDate, setRelativePeriod, setStartDate, setEndDate }) => (
    <div style={styles.container}>
        <RelativePeriodsSelect
            value={period ? period : 'START_END_DATES'}
            onChange={setRelativePeriod}
            style={styles.periods}
        />
        {!period ?
            <div style={styles.dates}>
                <DatePicker
                    label={i18next.t('Start date')}
                    value={startDate}
                    onChange={setStartDate}
                    style={styles.datePicker}
                    textFieldStyle={styles.dateField}
                />
                <DatePicker
                    label={i18next.t('End date')}
                    value={endDate}
                    onChange={setEndDate}
                    style={styles.datePicker}
                    textFieldStyle={styles.dateField}
                />
            </div>
        : null}
    </div>
);


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
