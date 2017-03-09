import { Component } from 'react';

class LayersEdit extends Component {

    /*
    constructor(props, context) {
        super(props, context);

        console.log('constrctor');
    }
    */

    componentDidUpdate(prevProps) {
        const overlays = this.props.overlays;

        overlays.filter(layer => layer.edit).map(layer => {
            const type = layer.layerType;

            if (gis && gis.layer && gis.layer[type]) {
                const editWindow = gis.layer[type].window;

                editWindow.layer = layer; // Temporary hack

                editWindow.onUpdate = (layer) => {
                    editWindow.hide();

                    layer.mapShouldUpdate = true; // TODO: Better way?

                    this.props.onOverlayUpdate(layer); // TODO: Rename to load?
                }

                editWindow.show();
            }
        });
    }

    componentWillUnmount() {
        console.log('unmount');
    }

    // React rendering will happen here later :-)
    render() {
        return null;
    }

}


export default LayersEdit;


