import { connect } from 'react-redux';
import RelocateDialog from '../components/orgunits/RelocateDialog';
import { changeOrgUnitCoordinate, stopRelocateOrgUnit} from '../actions/orgUnit';

const mapStateToProps = state => ({
    ...state.relocate
});

export default connect(
    mapStateToProps,
    { changeOrgUnitCoordinate, stopRelocateOrgUnit, }
)(RelocateDialog);
