import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { sortOverlays } from '../actions';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap,
    basemaps: state.basemaps,
    overlays: state.map.overlays,
});

const mapDispatchToProps = ({
    onSortEnd: sortOverlays,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersPanel);
