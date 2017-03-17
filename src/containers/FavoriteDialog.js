import { connect } from 'react-redux'
import FavoriteDialog from '../components/favorite/FavoriteDialog';
import { loadFavorite, closeFavoriteDialog } from '../actions';

const mapStateToProps = (state) => ({
    layersDialogOpen: state.ui.favoriteDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    onClose: () => dispatch(closeFavoriteDialog()),
    onFavoriteSelect: id => {
        dispatch(closeFavoriteDialog());
        dispatch(loadFavorite(id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteDialog);







