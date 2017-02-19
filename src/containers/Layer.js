import { connect } from 'react-redux';
import Layer from '../components/layer/Layer';
import { removeLayer, changeLayerOpacity, toggleLayerExpand, toggleLayerVisibility, openDataTable } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

const mapDispatchToProps = ({
    onRemove: removeLayer,
    onExpandChange: toggleLayerExpand,
    onOpacityChange: changeLayerOpacity,
    onVisibilityChange: toggleLayerVisibility,
    onDataTableShow: openDataTable,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Layer);
