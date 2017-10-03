import { connect } from 'react-redux';
import RelativePeriodsSelect from '../components/periods/RelativePeriodsSelect';

const mapStateToProps = (state) => ({
    periods: state.relativePeriods,
});

export default connect(
    mapStateToProps,
    { }
)(RelativePeriodsSelect);