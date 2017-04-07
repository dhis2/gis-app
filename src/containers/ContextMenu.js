import { connect } from 'react-redux';
import ContextMenu from '../components/map/ContextMenu';
import { closeContextMenu, openCoordinatePopup } from '../actions/map';
import { drillOverlay } from '../actions/overlays';
import { openOrgUnit, startRelocateOrgUnit, changeOrgUnitCoordinate} from '../actions/orgUnit';

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
    onRelocateStart: (layerId, feature) => {
        dispatch(closeContextMenu());
        console.log('startRelocateOrgUnit', layerId, feature);
        dispatch(startRelocateOrgUnit(layerId, feature));
    },
    onSwapCoordinate: (layerId, featureId, coordinate) => {
        dispatch(closeContextMenu());
        dispatch(changeOrgUnitCoordinate(layerId, featureId, coordinate));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
