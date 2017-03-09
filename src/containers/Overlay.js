import { connect } from 'react-redux';
import OverlayCard from '../components/layer/OverlayCard';
import { editOverlay, removeOverlay, changeOverlayOpacity, toggleOverlayExpand, toggleOverlayVisibility, openDataTable } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

const mapDispatchToProps = ({
    onEdit: editOverlay,
    onRemove: removeOverlay,
    onExpandChange: toggleOverlayExpand,
    onOpacityChange: changeOverlayOpacity,
    onVisibilityChange: toggleOverlayVisibility,
    onDataTableShow: openDataTable,
});

export default connect(mapStateToProps, mapDispatchToProps)(OverlayCard);
