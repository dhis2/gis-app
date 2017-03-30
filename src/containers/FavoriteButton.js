import { connect } from 'react-redux'
import FavoritesButton from '../components/favorite/FavoritesButton';
import { openFavoritesDialog } from '../actions/favorites';

const mapDispatchToProps = ({
    onClick: openFavoritesDialog,
});

export default connect(null, mapDispatchToProps)(FavoritesButton);
