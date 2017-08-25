import { connect } from 'react-redux';
import EventDialog from '../components/event/EventDialog';
import { loadPrograms, loadProgramStages, loadProgramStageDataElements } from '../actions/programs';
import { loadOptionSet } from '../actions/optionSets';

const mapStateToProps = state => ({
    programs: state.programs,
    optionSets: state.optionSets,
});

export default connect(
    mapStateToProps,
    { loadPrograms, loadProgramStages, loadProgramStageDataElements, loadOptionSet }
)(EventDialog);
