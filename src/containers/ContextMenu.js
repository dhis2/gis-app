import { connect } from 'react-redux';
import ContextMenu from '../components/map/ContextMenu';
// import { editOverlay } from '../actions/overlays';

const mapStateToProps = (state) => ({
    // layers: state.layers,
});

const mapDispatchToProps = ({
    // onEdit: editOverlay,
});

// export default connect(mapStateToProps, mapDispatchToProps)(OverlayCard);
export default connect(undefined, mapDispatchToProps)(ContextMenu);