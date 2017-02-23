import { connect } from 'react-redux';
import OverlayCard from '../components/layer/OverlayCard';
import { removeOverlay, changeOverlayOpacity, toggleOverlayExpand, toggleOverlayVisibility, openDataTable } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

const mapDispatchToProps = ({
    onRemove: removeOverlay,
    onExpandChange: toggleOverlayExpand,
    onOpacityChange: changeOverlayOpacity,
    onVisibilityChange: toggleOverlayVisibility,
    onDataTableShow: openDataTable,
});

export default connect(mapStateToProps, mapDispatchToProps)(OverlayCard);
