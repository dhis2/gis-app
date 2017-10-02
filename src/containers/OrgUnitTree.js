import { connect } from 'react-redux';
import OrgUnitTree from '../components/orgunits/OrgUnitTree';
import { toggleOrganisationUnit } from '../actions/layerEdit';

const mapStateToProps = state => ({
    root: state.orgUnitTree,
});

export default connect(
    mapStateToProps,
    { toggleOrganisationUnit, }
)(OrgUnitTree);
