import { connect } from 'react-redux';
import Basemaps from '../components/layer/Basemaps';
import { basemapSelected } from '../actions';

const mapStateToProps = (state) => ({
    basemaps: state.basemaps,
});

const mapDispatchToProps = ({
    onBasemapSelect: basemapSelected,
});

export default connect(mapStateToProps, mapDispatchToProps)(Basemaps);
