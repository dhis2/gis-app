import { connect } from 'react-redux'
import AddLayerDialog from '../components/layer/AddLayerDialog';
import { addLayer, closeLayersDialog } from '../actions';

// TODO: More elegant way?
const mapStateToProps = (state) => ({
    overlays: state.overlays,
    layersDialogOpen: state.ui.layersDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    onRequestClose: closeLayersDialog,
    onLayerSelect: (layer) => {
        dispatch(addLayer(layer));
        dispatch(closeLayersDialog());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);







