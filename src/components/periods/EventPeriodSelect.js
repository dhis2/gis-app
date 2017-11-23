import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import RelativePeriodSelect from './RelativePeriodSelect';
import DatePicker from '../d2-ui/DatePicker';
import { getPeriodFromFilters } from '../../util/analytics';
import { setPeriod, setStartDate, setEndDate } from '../../actions/layerEdit';

const styles = {
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

export const EventPeriodSelect = ({ period, startDate, endDate, setPeriod, setStartDate, setEndDate, style }) => [
    <RelativePeriodSelect
        key='period'
        startEndDates={true}
        period={period ? period.id : 'START_END_DATES'}
        onChange={setPeriod}
        style={style}
    />,
    (!period || period.id === 'START_END_DATES' ?
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
    period: PropTypes.object,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    setPeriod: PropTypes.func.isRequired,
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
};

export default connect(
    ({ layerEdit }) => ({
        period: getPeriodFromFilters(layerEdit.filters),
        startDate: layerEdit.startDate,
        endDate: layerEdit.endDate,
    }),
    { setPeriod, setStartDate, setEndDate }
)(EventPeriodSelect);
