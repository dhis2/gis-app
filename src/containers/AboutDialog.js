import { connect } from 'react-redux';
import AboutDialog from '../components/about/AboutDialog';
import { closeAboutDialog } from '../actions/about';

const mapStateToProps = state => ({
    aboutDialogOpen: state.ui.aboutDialogOpen,
});

export default connect(
    mapStateToProps,
    { closeAboutDialog, }
)(AboutDialog);
