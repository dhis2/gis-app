import { connect } from 'react-redux'
import AppMenu from '../components/app/AppMenu';
import { openOverlaysDialog } from '../actions/overlays';
import { openFavoritesDialog } from '../actions/favorites';

export default connect(
    null,
    { openOverlaysDialog, openFavoritesDialog }
)(AppMenu);
