import { connect } from 'react-redux';
import ProgramSelect from '../components/program/ProgramSelect';
// import { closeAboutDialog } from '../actions/about';

const mapStateToProps = state => ({
    programs: state.programs
});

export default connect(
    mapStateToProps,
    { /* closeAboutDialog, */ }
)(ProgramSelect);
