import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Button from 'd2-ui/lib/button/Button';
import WidgetWindow from '../../app/WidgetWindow';
import EventDialog from '../../containers/EventDialog';

// Only create one widget per layer (will be changed when we switch to react)
const widgets = {};
const editCounter = {};

let nextOverlayId = 0;

const styles = {
    body: {
        padding: 0,
        minHeight: 300,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    /*
     content: {
     padding: '0 24px 16px',
     minHeight: 300,
     },
     */
};

class LayerEdit extends Component {

    componentDidUpdate(prevProps) {
        const props = this.props;

        if (props.layer) {
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
            } else  if (!layer.preview) { // TODO
                if (!widgets[id]) {
                    editCounter[id] = 0;

                    widgets[id] = WidgetWindow(gis, layer, (editedLayer) => {
                        editedLayer.isLoaded = false;

                        editedLayer.editCounter = ++editCounter[editedLayer.id];

                        editedLayer.isNew = layer.isNew;

                        widgets[id].hide();

                        // console.log('editedLayer', JSON.stringify(editedLayer));

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
    }

    addLayer() {
        this.props.layer.id = 'overlay-1'; // TODO

        this.props.getOverlay(this.props.layer);
        this.closeDialog();
    }

    closeDialog() {
        this.props.cancelOverlay();
    }

    onLayerChange(config) {
        this.config = config;
        // console.log('onLayerChange', config);
    }

    // React rendering will happen here later :-)
    render() {
        const layer = this.props.layer;

        if (!layer || !layer.preview) {
            return null;
        }

        return (
            <Dialog
                title={layer.title} // TODO: i18n
                bodyStyle={styles.body}
                titleStyle={styles.title}
                open={true}
                actions={[
                    <Button
                        color='primary'
                        onClick={() => this.closeDialog()}
                        selector='cancel'
                    >Cancel</Button>,
                    <Button
                        color='primary'
                        onClick={() => this.addLayer()}
                        selector='add'
                    >Add layer</Button>
                ]}
            >
                {layer.type === 'event' ?
                    <EventDialog
                        {...layer}
                        // onChange={(config) => this.onLayerChange(config)}
                    />
                : null}
            </Dialog>
        );
    }
}

export default LayerEdit;


