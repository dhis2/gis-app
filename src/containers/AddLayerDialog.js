import { connect } from 'react-redux'
import AddLayerDialog from '../components/layer/AddLayerDialog';
import { editOverlay, closeOverlaysDialog } from '../actions/overlays';

const mapStateToProps = (state) => ({
    overlays: state.overlays,
    overlaysDialogOpen: state.ui.overlaysDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    // onRequestClose: closeLayersDialog,
    onRequestClose: () => dispatch(closeOverlaysDialog()),
    onLayerSelect: layer => {
        dispatch(closeOverlaysDialog());
        dispatch(editOverlay({...layer}));
    },
});

/*
const mapDispatchToProps = ({
    onRequestClose: closeLayersDialog,
});
*/

export default connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);







