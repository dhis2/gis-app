import { connect } from 'react-redux'
import AppMenu from '../components/app/AppMenu';
import { openOverlaysDialog } from '../actions/overlays';
import { openFavoritesDialog } from '../actions/favorites';
import { openAboutDialog } from '../actions/about';

const mapStateToProps = state => ({
    // contextPath: state.system.contextPath,
});

export default connect(
    mapStateToProps,
    { openOverlaysDialog, openFavoritesDialog, openAboutDialog }
)(AppMenu);
