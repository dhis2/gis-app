import { connect } from 'react-redux'
import AppMenu from '../components/app/AppMenu';
import { openOverlaysDialog } from '../actions/overlays';
import { openFavoritesDialog } from '../actions/favorites';
import { openAboutDialog } from '../actions/about';

export default connect(
    null,
    { openOverlaysDialog, openFavoritesDialog, openAboutDialog }
)(AppMenu);
