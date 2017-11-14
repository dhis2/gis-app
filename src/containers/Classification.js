import { connect } from 'react-redux';
import Classification from '../components/style/Classification';
import { setClassification, setColorScale } from '../actions/layerEdit';

export default connect(
    null,
    { setClassification, setColorScale }
)(Classification);