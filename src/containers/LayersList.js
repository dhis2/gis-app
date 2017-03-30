import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { requestOverlayLoad, getOverlay, sortOverlays } from '../actions/overlays';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap,
    basemaps: state.basemaps,
    overlays: state.map.overlays,
});

const mapDispatchToProps = ({
    loadOverlay: getOverlay,
    requestOverlayLoad: requestOverlayLoad,
    onSortEnd: sortOverlays,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersPanel);
