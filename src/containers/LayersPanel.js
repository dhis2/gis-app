import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { requestOverlayLoad, sortOverlays } from '../actions/overlays';
import { openLayersPanel, closeLayersPanel } from '../actions/ui';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap,
    basemaps: state.basemaps,
    overlays: state.map.overlays,
    layersPanelOpen: state.ui.layersPanelOpen,
});

export default connect(
    mapStateToProps,
    { requestOverlayLoad, sortOverlays, openLayersPanel, closeLayersPanel, }
)(LayersPanel);
