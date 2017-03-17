import { Component } from 'react';
import FavoriteWindow from '../../app/FavoriteWindow';

class FavoriteDialog extends Component {

    componentDidUpdate(prevProps) {
        const props = this.props;

        if (this.props.layersDialogOpen) {
            this.favoriteWindow = FavoriteWindow(gis); // TODO: Reuse favorite window?
            this.favoriteWindow.onFavoriteClick = props.onFavoriteSelect;
            this.favoriteWindow.onClose = props.onClose;
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


export default FavoriteDialog;
