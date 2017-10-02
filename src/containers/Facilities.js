import { connect } from 'react-redux';
import Facilities from '../components/edit/Facilities';
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
)(Facilities);
