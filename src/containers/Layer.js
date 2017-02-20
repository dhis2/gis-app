import { connect } from 'react-redux';
import LayerCard from '../components/layer/LayerCard';
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

export default connect(mapStateToProps, mapDispatchToProps)(LayerCard);
