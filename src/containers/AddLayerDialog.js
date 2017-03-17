import { connect } from 'react-redux'
import AddLayerDialog from '../components/layer/AddLayerDialog';
import { editOverlay, closeLayersDialog } from '../actions';

const mapStateToProps = (state) => ({
    overlays: state.overlays,
    layersDialogOpen: state.ui.layersDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    // onRequestClose: closeLayersDialog,
    onRequestClose: () => dispatch(closeLayersDialog()),
    onLayerSelect: layer => {
        dispatch(closeLayersDialog());
        dispatch(editOverlay({...layer}));
    },
});

/*
const mapDispatchToProps = ({
    onRequestClose: closeLayersDialog,
});
*/

export default connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);






