import { Component } from 'react';
import WidgetWindow from '../../app/WidgetWindow';

// Only create one widget per layer (will be changed when we switch to react)
const widgets = {};
const editCounter = {};


let nextOverlayId = 0;

class LayersEdit extends Component {

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

        // console.log('isNew', isNew);

        if (!widgets[id]) {
            editCounter[id] = 0;
            widgets[id] = WidgetWindow(gis, layer, (editedLayer) => {
                // console.log('inside', isNew);

                editedLayer.editCounter = ++editCounter[editedLayer.id];

                // editedLayer.isNew = isNew;
                // console.log('editedLayer', editedLayer.isNew);

                widgets[id].hide();
                props.loadOverlay(editedLayer);
            });
        } else {
            layer.isNew = false;
            // editCounter[id];
            widgets[id].setLayer(layer);
        }

        widgets[id].show();
    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }

}


export default LayersEdit;


