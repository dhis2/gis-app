import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { sortLayers } from '../actions';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap,
    basemaps: state.basemaps,
    overlays: state.map.overlays,
});

const mapDispatchToProps = ({
    onSortEnd: sortLayers,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersPanel);
