import { connect } from 'react-redux';
import OrgUnits from '../components/orgunits/OrgUnits';
import { toggleOrganisationUnit } from '../actions/layerEdit';

const mapStateToProps = state => ({
    root: state.orgUnitTree,
});

export default connect(
    mapStateToProps,
    { toggleOrganisationUnit, }
)(OrgUnits);
