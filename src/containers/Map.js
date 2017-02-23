import { connect } from 'react-redux';
import Map from '../components/map/Map';
// import { closeDataTable } from '../actions';

const mapStateToProps = (state) => ({
    ...state.map,
    basemaps: state.basemaps,
});

const mapDispatchToProps = ({
    //onRequestClose: closeDataTable,
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
