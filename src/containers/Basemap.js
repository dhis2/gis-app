import { connect } from 'react-redux';
import BasemapCard from '../components/layers/basemaps/BasemapCard';
import { changeBasemapOpacity, toggleBasemapExpand, toggleBasemapVisibility, selectBasemap } from '../actions/basemap';

const mapStateToProps = (state) => ({
    basemap: state.map.basemap, // Selected basemap
    basemaps: state.basemaps, // All basemaps
});

export default connect(
    mapStateToProps,
    { changeBasemapOpacity, toggleBasemapExpand, toggleBasemapVisibility, selectBasemap, }
)(BasemapCard);
