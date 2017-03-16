import { Component } from 'react';
import WidgetWindow from '../../app/WidgetWindow';

class LayersEdit extends Component {

    componentDidUpdate(prevProps) {
        const layer = this.props.layer;

        if (layer) {
            const widget = WidgetWindow(gis, layer, (layer) => {
                widget.hide(); // TODO: Destroy widget
                this.props.loadOverlay(layer);
            });

            widget.show();
        }
    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }

}


export default LayersEdit;


