import { connect } from 'react-redux'
import AddLayerDialog from '../components/layer/AddLayerDialog';
import { editOverlay, addOverlay, closeLayersDialog } from '../actions';

const mapStateToProps = (state) => ({
    overlays: state.overlays,
    layersDialogOpen: state.ui.layersDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    // onRequestClose: closeLayersDialog,
    onRequestClose: () => dispatch(closeLayersDialog()),
    onLayerSelect: (layer) => {
        // console.log('before', layer);

        dispatch(closeLayersDialog());
        dispatch(addOverlay(layer));

        //  dispatch(editOverlay(layer));


        /*
        if (gis && gis.layer && gis.layer[layer.type]) {
            const layerWindow = gis.layer[layer.type].window;

            // Warning: Very ugly hack!
            window.layerCallback = (view) => {
                window.layerCallback = null;
                layerWindow.hide();

                view.title = 'Facilities';

                // console.log('layer view',view);

                //if (config.layerConfig) {
                    // layer.config = config.layerConfig;
                    // console.log('after', layer, addOverlay);

                    // delete(layer.type);

                    dispatch(addOverlay(view));
                // }
            }

            layerWindow.show();
        } else {
            dispatch(addOverlay(layer));
        }
        */
    },
});

/*
const mapDispatchToProps = ({
    onRequestClose: closeLayersDialog,
});
*/

export default connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);







