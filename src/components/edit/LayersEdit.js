import { Component } from 'react';
import WidgetWindow from '../../app/WidgetWindow';

const widgets = {}; // TODO: Temporary widget store

class LayersEdit extends Component {

    componentDidUpdate(prevProps) {
        this.props.overlays.filter(layer => layer.edit).map(layer => this.editLayer(layer));
    }

    componentWillUnmount() {
        console.log('unmount'); // TODO
    }

    // Called for each layer in edit mode
    editLayer(layer) {
        let widget = widgets[layer.id];

        if (!widget) { // Create widget first time
            widget = widgets[layer.id] = WidgetWindow(gis, layer, (layer) => {
                widget.hide();
                this.props.onOverlayUpdate(layer);
            })
        } else {
            // widget.setLayer(layer);
        }

        widget.show();
    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }

}


export default LayersEdit;


