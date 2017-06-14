import { connect } from 'react-redux';
import Map from '../components/map/Map';
import { openContextMenu, closeCoordinatePopup } from '../actions/map';

const mapStateToProps = (state) => ({
    ...state.map,
    basemaps: state.basemaps,
    layersPanelOpen: state.ui.layersPanelOpen,
    dataTableOpen: state.dataTable,
    dataTableHeight: state.ui.dataTableHeight,
});

export default connect(
    mapStateToProps,
    { openContextMenu, closeCoordinatePopup, }
)(Map);
