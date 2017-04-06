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
    onRelocate: (layerId, feature) => {
        dispatch(closeContextMenu());
        dispatch(relocateOrgUnit(layerId, feature));
    },
    onSwapCoordinate: (layerId, feature) => {
        dispatch(closeContextMenu());
        dispatch(swapOrgUnitCoordinate(layerId, feature));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
