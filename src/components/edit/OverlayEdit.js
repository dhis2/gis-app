import { Component } from 'react';
import WidgetWindow from '../../app/WidgetWindow';

// Only create one widget per layer (will be changed when we switch to react)
const widgets = {};
const editCounter = {};

let nextOverlayId = 0;

class OverlayEdit extends Component {

    componentDidUpdate(prevProps) {
        const props = this.props;
        const layer = {...props.layer};
        let id = layer.id;

        if (!id) { // New layer
            id = 'overlay-' + nextOverlayId++;
            layer.id = id;
            layer.isNew = true;
        } else {
            layer.isNew = false;
        }

        if (layer.type === 'external') { // External layers has no edit widget
            layer.editCounter = 1;
            props.getOverlay(layer);
        } else {
            if (!widgets[id]) {
                editCounter[id] = 0;

                widgets[id] = WidgetWindow(gis, layer, (editedLayer) => {
                    editedLayer.isLoaded = false;

                    editedLayer.editCounter = ++editCounter[editedLayer.id];

                    editedLayer.isNew = layer.isNew;

                    widgets[id].hide();
                    props.getOverlay(editedLayer);
                });

                if (layer.isLoaded) { // Loaded as favorite
                    widgets[id].show();
                    editCounter[id]++;
                    widgets[id].setLayer(layer);
                }
            } else {
                layer.isNew = false;
            }

            widgets[id].show();
        }


    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }
}

export default OverlayEdit;


