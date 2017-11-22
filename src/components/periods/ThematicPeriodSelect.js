import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PeriodTypeSelect from './PeriodTypeSelect';
import PeriodSelect from './PeriodSelect';
import { setPeriodType, setPeriod } from '../../actions/layerEdit';

const ThematicPeriodSelect = ({ periodType, period, setPeriodType, setPeriod, style}) => {

    console.log('period', period);

    return [
        <PeriodTypeSelect
            key='periodtype'
            value={periodType}
            onChange={type => setPeriodType(type.id)}
            style={style}
        />,
        (periodType === 'relativePeriods' ?
            <div key='relative'>Relative periods</div>
        : periodType ?
            <PeriodSelect
                key='periods'
                periodType={periodType}
                period={period}
                onChange={period => setPeriod(period.id)}
                style={style}
            />
        : null),
    ];
};

ThematicPeriodSelect.propTypes = {
    period: PropTypes.string,
};

export default connect(
    (state) => ({
        periodType: state.layerEdit.periodType,
        period: state.layerEdit.filters ? state.layerEdit.filters[0].items[0].id : null,
    }),
    { setPeriodType, setPeriod }
)(ThematicPeriodSelect);
