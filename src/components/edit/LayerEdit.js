import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import i18next from 'i18next';
import Button from 'd2-ui/lib/button/Button';
import WidgetWindow from '../../app/WidgetWindow';
import EventDialog from './EventDialog';
import FacilityDialog from './FacilityDialog';
import ThematicDialog from './thematic/ThematicDialog';
import BoundaryDialog from './BoundaryDialog';
import { getOverlay, cancelOverlay } from '../../actions/overlays';

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
        // background: '#1E88E5',
        // background: '#fff',
        // color: '#fff',
    },
};

class LayerEdit extends Component {

    componentDidUpdate(prevProps) {
        const { layer, getOverlay } = this.props;

        // console.log('componentDidUpdate');


        if (layer) {
            const config = { ...layer };
            let id = config.id;

            if (!id) { // New layer
                // console.log('new layer');
                id = 'overlay-' + nextOverlayId++;
                config.id = id;
                config.isNew = true;
                // layer.isLoaded = false;
            } else {
                // console.log('edit layer');

                config.isNew = false;
            }

            if (config.type === 'external') { // External layers has no edit widget
                config.editCounter = 1;
                getOverlay(config);
            } else  if (!config.preview) { // TODO
                if (!widgets[id]) {
                    editCounter[id] = 0;

                    widgets[id] = WidgetWindow(gis, config, (editedLayer) => {
                        widgets[id].hide();
                        getOverlay(editedLayer);
                    });

                    if (config.isLoaded) { // Loaded as favorite
                        widgets[id].show();
                        console.log('####');
                        editCounter[id]++;
                        widgets[id].setLayer(config);
                    }
                } else {
                    config.isNew = false;
                }

                widgets[id].show();
            }
        }

    }

    addLayer() {
        const { layer, getOverlay } = this.props;

        const config = {
            ...layer,
            id: 'overlay-' + nextOverlayId++,
            isLoaded: false,
        };

        getOverlay(config);
        this.closeDialog();
    }

    updateLayer() {
        const { layer, getOverlay } = this.props;

        getOverlay({
            ...layer,
            isLoaded: false,
        });

        this.closeDialog();
    }

    closeDialog() {
        this.props.cancelOverlay();
    }

    onLayerChange(config) {
        this.config = config;
        // console.log('onLayerChange', config);
    }

    render() {
        const config = this.props.layer;

        if (!config || !config.preview) {
            return null;
        }

        return (
            <Dialog
                title={config.title} // TODO: i18n
                bodyStyle={styles.body}
                titleStyle={styles.title}
                open={true}
                actions={[
                    <Button
                        color='primary'
                        onClick={() => this.closeDialog()}
                        selector='cancel'
                    >{i18next.t('Cancel')}</Button>,
                    (config.editCounter ?
                        <Button
                            color='primary'
                            onClick={() => this.updateLayer()}
                            selector='update'
                        >{i18next.t('Update layer')}</Button>
                    :
                        <Button
                            color='primary'
                            onClick={() => this.addLayer()}
                            selector='add'
                        >{i18next.t('Add layer')}</Button>
                    )
                ]}
            >
                {config.type === 'event' ? <EventDialog {...config} /> : null}
                {config.type === 'facility' ? <FacilityDialog {...config} /> : null}
                {config.type === 'thematic' ? <ThematicDialog {...config} /> : null}
                {config.type === 'boundary' ? <BoundaryDialog {...config} /> : null}
            </Dialog>
        );
    }
}

export default connect(
    (state) => ({
        layer: state.layerEdit,
    }),
    { getOverlay, cancelOverlay }
)(LayerEdit);
