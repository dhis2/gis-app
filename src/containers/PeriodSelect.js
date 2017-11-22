import { connect } from 'react-redux';
import PeriodSelect from '../components/periods/EventPeriodSelect';
import {
    setRelativePeriod,
    setStartDate,
    setEndDate,
} from '../actions/layerEdit';

const mapStateToProps = (state) => {
    const config = state.layerEdit;
    const period = (config.filters || []).filter(r => r.dimension === 'pe')[0];
    const startDate = config.startDate;
    const endDate = config.endDate;

    return {
        period: period ? period.items[0].id : null,
        startDate,
        endDate,
    };
};

export default connect(
    mapStateToProps,
    {
        setRelativePeriod,
        setStartDate,
        setEndDate,
    }
)(PeriodSelect);
