import { connect } from 'react-redux';
import OrgUnitDialog from '../components/OrgUnit/OrgUnitDialog';
// import { closeContextMenu } from '../actions/map';
// import { drillOverlay } from '../actions/overlays';

const mapStateToProps = state => ({
    ...state.orgUnit
});

const mapDispatchToProps = ({
    // onRequestClose: closeContextMenu,
    // onDrill: drillOverlay,
});

// console.log('orgUnitDialog', OrgUnitDialog);

export default connect(mapStateToProps, mapDispatchToProps)(OrgUnitDialog);
