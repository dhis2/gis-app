import { connect } from 'react-redux';
import OverlayCard from '../components/layer/OverlayCard';
import { editOverlay, removeOverlay, changeOverlayOpacity, toggleOverlayExpand, toggleOverlayVisibility } from '../actions/overlays';
import { openDataTable } from '../actions/dataTable';

export default connect(
    null,
    { editOverlay, removeOverlay, changeOverlayOpacity, toggleOverlayExpand, toggleOverlayVisibility, openDataTable, }
)(OverlayCard);
