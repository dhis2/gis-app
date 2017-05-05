import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { requestOverlayLoad, sortOverlays } from '../actions/overlays';
import { openLayersPanel, closeLayersPanel } from '../actions/ui';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap,
    basemaps: state.basemaps,
    overlays: state.map.overlays,
    ui: state.ui,
});

const mapDispatchToProps = ({
    requestOverlayLoad,
    sortOverlays,
    openLayersPanel,
    closeLayersPanel,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersPanel);
