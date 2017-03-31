import { connect } from 'react-redux';
import Map from '../components/map/Map';
import { openContextMenu } from '../actions/map';

const mapStateToProps = (state) => ({
    ...state.map,
    basemaps: state.basemaps,
});

const mapDispatchToProps = ({
    openContextMenu,
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
