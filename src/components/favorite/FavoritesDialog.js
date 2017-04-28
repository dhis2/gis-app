import { Component } from 'react';
import FavoriteWindow from '../../app/FavoriteWindow';

class FavoritesDialog extends Component {

    componentDidUpdate(prevProps) {
        const props = this.props;

        // console.log('FavoritesDialog map', props.map);

        if (this.props.favoritesDialogOpen) {

            if (!this.favoriteWindow) { // Only create once
                this.favoriteWindow = FavoriteWindow(gis);
                this.favoriteWindow.onFavoriteClick = props.onFavoriteSelect;
                this.favoriteWindow.onClose = props.onClose;
            }

            this.favoriteWindow.map = props.map; // Hack to make map definition available within the Ext component

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
