import { connect } from 'react-redux';
import OrgUnitDialog from '../components/orgunits/OrgUnitDialog';
import { closeOrgUnit } from '../actions/orgUnits';

const mapStateToProps = state => ({
    ...state.orgUnit
});

export default connect(
    mapStateToProps,
    { closeOrgUnit, }
)(OrgUnitDialog);
