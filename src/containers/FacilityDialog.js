import { connect } from 'react-redux';
import FacilityDialog from '../components/facility/FacilityDialog';
import { loadOrgUnitGroupSets } from '../actions/orgUnitGroupSets';
import {
    setOrganisationUnitGroupSet
} from '../actions/layerEdit';

const mapStateToProps = (state) => ({
    orgUnitGroupSets: state.orgUnitGroupSets,

});

export default connect(
    mapStateToProps,
    {
        loadOrgUnitGroupSets,
        setOrganisationUnitGroupSet,
    }
)(FacilityDialog);
