import { connect } from 'react-redux';
import RelocateDialog from '../components/orgUnit/RelocateDialog';
import { changeOrgUnitCoordinate, stopRelocateOrgUnit} from '../actions/orgUnit';

const mapStateToProps = state => ({
    ...state.relocate
});

const mapDispatchToProps = ({
    changeOrgUnitCoordinate,
    stopRelocateOrgUnit,
});

export default connect(mapStateToProps, mapDispatchToProps)(RelocateDialog);
