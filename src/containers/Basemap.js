import { connect } from 'react-redux';
import BasemapCard from '../components/layer/BasemapCard';
import { changeBasemapOpacity, toggleBasemapExpand, toggleBasemapVisibility, basemapSelected } from '../actions';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap, // Selected basemap
    basemaps: state.basemaps, // All basemaps
});

const mapDispatchToProps = ({
    onExpandChange: toggleBasemapExpand,
    onOpacityChange: changeBasemapOpacity,
    onVisibilityChange: toggleBasemapVisibility,
    onBasemapSelect: basemapSelected,
});

export default connect(mapStateToProps, mapDispatchToProps)(BasemapCard);
