import { connect } from 'react-redux'
import FavoriteButton from '../components/favorite/FavoriteButton';
import { openFavoriteDialog } from '../actions';

const mapDispatchToProps = ({
    onClick: openFavoriteDialog,
});

export default connect(null, mapDispatchToProps)(FavoriteButton);
