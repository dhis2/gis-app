import { connect } from 'react-redux';
import Basemaps from '../layer/Basemaps';
import { basemapSelected } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

const mapDispatchToProps = ({
    onBasemapSelect: basemapSelected,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Basemaps);
