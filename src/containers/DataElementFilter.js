import { connect } from 'react-redux';
import DataElementFilter from '../components/dataelement/DataElementFilter';
import { loadOptionSet } from '../actions/optionSets';

const mapStateToProps = (state) => ({
    optionSets: state.optionSets,
});

export default connect(
    mapStateToProps,
    { loadOptionSet }
)(DataElementFilter);
