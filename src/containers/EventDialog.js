import { connect } from 'react-redux';
import EventDialog from '../components/event/EventDialog';
import { loadPrograms, loadProgramStages, loadProgramStageDataElements } from '../actions/programs';

const mapStateToProps = state => ({
    programs: state.programs
});

export default connect(
    mapStateToProps,
    { loadPrograms, loadProgramStages, loadProgramStageDataElements }
)(EventDialog);
