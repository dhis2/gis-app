import { connect } from 'react-redux';
import OrgUnitDialog from '../components/OrgUnit/OrgUnitDialog';
import { closeOrgUnit } from '../actions/orgUnit';

const mapStateToProps = state => ({
    ...state.orgUnit
});

const mapDispatchToProps = ({
    onClose: closeOrgUnit,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrgUnitDialog);
