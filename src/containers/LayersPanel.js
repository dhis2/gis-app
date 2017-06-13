import { connect } from 'react-redux';
import LayersPanel from '../components/layers/LayersPanel'
import { requestOverlayLoad, sortOverlays } from '../actions/overlays';

const mapStateToProps = (state) => ({
    basemap: {
        ...state.basemaps.filter(b => b.id === state.map.basemap.id)[0],
        ...state.map.basemap,
    },
    overlays: state.map.overlays,
    basemaps: state.basemaps,
    layersPanelOpen: state.ui.layersPanelOpen,
});

export default connect(
    mapStateToProps,
    { requestOverlayLoad, sortOverlays }
)(LayersPanel);
