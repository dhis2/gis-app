import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import RelativePeriodsSelect from '../../containers/RelativePeriodsSelect';
import DatePicker from '../d2-ui/DatePicker';

const styles = {
    periods: {
        flex: '50%',
        boxSizing: 'border-box',
        minWidth: 230,
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
    dates: {
        flex: '50%',
        minWidth: 230,
        display: 'flex',
        justifyContent: 'space-between',
    },
    datePicker: {
        flex: '50%',
        boxSizing: 'border-box',
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
    dateField: {
        width: '100%',
    },
};

const EventPeriodSelect = ({ period, startDate, endDate, setRelativePeriod, setStartDate, setEndDate }) =>
    [
        <RelativePeriodsSelect
            key='period'
            value={period ? period : 'START_END_DATES'}
            onChange={setRelativePeriod}
            style={styles.periods}
        />,
        (!period ?
            <div key='dates' style={styles.dates}>
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
        : null)
    ];

EventPeriodSelect.propTypes = {
    period: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    setRelativePeriod: PropTypes.func.isRequired,
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
};

export default EventPeriodSelect;
