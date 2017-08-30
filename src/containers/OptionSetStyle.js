import { connect } from 'react-redux';
import OptionSetStyle from '../components/event/OptionSetStyle';
import { loadOptionSet } from '../actions/optionSets';
import { setStyleOptions } from '../actions/layerEdit';



const mapStateToProps = (state) => ({
    optionSets: state.optionSets,
});

export default connect(
    mapStateToProps,
    { loadOptionSet, setStyleOptions }
)(OptionSetStyle);


