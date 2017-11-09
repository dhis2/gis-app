import { connect } from 'react-redux';
import FilterSelect from '../components/filter/FilterSelect';
import { loadOptionSet } from '../actions/optionSets';

const mapStateToProps = (state) => ({
    optionSets: state.optionSets,
});

export default connect(
    mapStateToProps,
    { loadOptionSet }
)(FilterSelect);
