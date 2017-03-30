import { Component } from 'react';
import FavoriteWindow from '../../app/FavoriteWindow';

class FavoritesDialog extends Component {

    componentDidUpdate(prevProps) {
        const props = this.props;

        if (this.props.favoritesDialogOpen) {
            if (!this.favoriteWindow) { // Only create once
                this.favoriteWindow = FavoriteWindow(gis);
                this.favoriteWindow.onFavoriteClick = props.onFavoriteSelect;
                this.favoriteWindow.onClose = props.onClose;
            }
            this.favoriteWindow.show();
        } else {
            this.favoriteWindow.hide();
        }
    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }

}


export default FavoritesDialog;
