import { connect } from 'react-redux';
import OrgUnitDialog from '../components/orgUnit/OrgUnitDialog';
import { closeOrgUnit } from '../actions/orgUnit';

const mapStateToProps = state => ({
    ...state.orgUnit
});

export default connect(
    mapStateToProps,
    { closeOrgUnit, }
)(OrgUnitDialog);
