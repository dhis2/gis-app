import { connect } from 'react-redux'
import AddLayerDialog from '../components/layers/overlays/AddOverlayDialog';
import { editOverlay, closeOverlaysDialog } from '../actions/overlays';

const mapStateToProps = (state) => ({
    overlays: state.overlays,
    overlaysDialogOpen: state.ui.overlaysDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    onRequestClose: () => dispatch(closeOverlaysDialog()),
    onLayerSelect: layer => {
        dispatch(closeOverlaysDialog());
        dispatch(editOverlay({...layer}));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);







