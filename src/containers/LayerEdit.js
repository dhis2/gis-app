import { connect } from 'react-redux';
import LayerEdit from '../components/edit/LayerEdit';
import { getOverlay, cancelOverlay } from '../actions/overlays';

const mapStateToProps = (state) => ({
    layer: state.layerEdit,
});

export default connect(
    mapStateToProps,
    { getOverlay, cancelOverlay }
)(LayerEdit);