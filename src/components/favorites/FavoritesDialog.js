import { Component } from 'react';
import FavoriteWindow from '../../app/FavoriteWindow';

class FavoritesDialog extends Component {

    componentDidUpdate(prevProps) {
        const {
            map,
            favoritesDialogOpen,
            onFavoriteSelect,
            closeFavoritesDialog,
        } = this.props;

        if (favoritesDialogOpen) {
            if (!this.favoriteWindow) { // Only create once
                this.favoriteWindow = FavoriteWindow(gis);
                this.favoriteWindow.onFavoriteClick = onFavoriteSelect;
                this.favoriteWindow.onClose = closeFavoritesDialog;
            }

            this.favoriteWindow.map = map; // Hack to make map definition available within the Ext component
            this.favoriteWindow.show();
        } else if (this.favoriteWindow) {
            this.favoriteWindow.hide();
        }
    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }

}


export default FavoritesDialog;
