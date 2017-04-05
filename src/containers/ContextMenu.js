import { connect } from 'react-redux';
import ContextMenu from '../components/map/ContextMenu';
import { closeContextMenu, openCoordinatePopup } from '../actions/map';
import { drillOverlay } from '../actions/overlays';
import { openOrgUnit, relocateOrgUnit, swapOrgUnitCoordinate} from '../actions/orgUnit';

const mapStateToProps = state => ({
    ...state.contextMenu
});

const mapDispatchToProps = (dispatch) => ({
    onClose: () => dispatch(closeContextMenu()),
    onDrill: (layerId, parentId, parentGraph, level) => dispatch(drillOverlay(layerId, parentId, parentGraph, level)),
    onShowInformation: attr => {
        dispatch(closeContextMenu());
        dispatch(openOrgUnit(attr));
    },
    showCoordinate: coord => {
        dispatch(closeContextMenu());
        dispatch(openCoordinatePopup(coord));
    },
    onRelocate: attr => {
        dispatch(closeContextMenu());
        dispatch(relocateOrgUnit(attr));
    },
    onSwapCoordinate: attr => {
        dispatch(closeContextMenu());
        dispatch(swapOrgUnitCoordinate(attr));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
