import { connect } from 'react-redux';
import RelocateDialog from '../components/orgUnit/RelocateDialog';
// import { closeOrgUnit } from '../actions/orgUnit';

const mapStateToProps = state => ({
    ...state.relocate
});

const mapDispatchToProps = ({
    // onClose: closeOrgUnit,
});

export default connect(mapStateToProps, mapDispatchToProps)(RelocateDialog);
