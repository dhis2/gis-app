import { connect } from 'react-redux';
import EventDialog from '../components/event/EventDialog';
import { closeAboutDialog } from '../actions/about';

const mapStateToProps = state => ({
    programs: state.programs
});

export default connect(
    mapStateToProps,
    { closeAboutDialog, }
)(EventDialog);
