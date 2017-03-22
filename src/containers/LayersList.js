import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { requestOverlayLoad, loadOverlay, sortOverlays } from '../actions';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap,
    basemaps: state.basemaps,
    overlays: state.map.overlays,
});

const mapDispatchToProps = ({
    loadOverlay: loadOverlay,
    requestOverlayLoad: requestOverlayLoad,
    onSortEnd: sortOverlays,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersPanel);
