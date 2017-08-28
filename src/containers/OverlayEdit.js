import { connect } from 'react-redux';
import OverlayEdit from '../components/edit/OverlayEdit';
import { getOverlay, cancelOverlay } from '../actions/overlays';

const mapStateToProps = (state) => ({
    layer: state.editOverlay,
});

export default connect(
    mapStateToProps,
    { getOverlay, cancelOverlay }
)(OverlayEdit);