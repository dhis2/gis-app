import { connect } from 'react-redux';
import Layer from '../layer/Layer';
import { removeLayer, changeLayerOpacity, toggleLayerExpand, toggleLayerVisibility } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

const mapDispatchToProps = ({
    onRemove: removeLayer,
    onExpandChange: toggleLayerExpand,
    onOpacityChange: changeLayerOpacity,
    onVisibilityChange: toggleLayerVisibility,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Layer);
