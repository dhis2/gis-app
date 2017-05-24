import { connect } from 'react-redux';
import Map from '../components/map/Map';
import { openContextMenu, closeCoordinatePopup } from '../actions/map';

const mapStateToProps = (state) => ({
    ...state.map,
    basemaps: state.basemaps,
    layersPanelOpen: state.ui.layersPanelOpen,
    dataTableOpen: state.ui.dataTableOpen,
    dataTableSize: state.ui.dataTableSize,
});

export default connect(
    mapStateToProps,
    { openContextMenu, closeCoordinatePopup, }
)(Map);
