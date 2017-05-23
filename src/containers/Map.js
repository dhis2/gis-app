import { connect } from 'react-redux';
import Map from '../components/map/Map';
import { openContextMenu, closeCoordinatePopup } from '../actions/map';

const mapStateToProps = (state) => ({
    ...state.map,
    basemaps: state.basemaps,
    ui: state.ui,
});

const mapDispatchToProps = ({
    openContextMenu,
    closeCoordinatePopup,
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);