import { connect } from 'react-redux';
import OverlayEdit from '../components/edit/OverlayEdit';
import { getOverlay } from '../actions/overlays';

const mapStateToProps = (state) => ({
    layer: state.editOverlay,
});

const mapDispatchToProps = ({
    getOverlay: getOverlay,
});

export default connect(mapStateToProps, mapDispatchToProps)(OverlayEdit);