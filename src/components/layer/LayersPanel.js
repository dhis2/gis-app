import React, { PropTypes } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Layer from '../containers/Layer';
// import AddLayer from '../containers/AddLayer';

const SortableLayer = SortableElement(Layer);

const SortableLayersList = SortableContainer(({layers}) => {
    const styles = {
        layers: {
            float: 'left',
            padding: 8,
            boxSizing: 'border-box',
            width: 300,
            height: 'calc(100% - 88px)',
            backgroundColor: '#fafafa',
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'scroll',
        },
        button: {
            position: 'absolute',
            bottom: 24,
            right: 24,
        }
    };

    return (
        <div style={styles.layers}>
            {layers.filter(layer => layer.type !== 'basemap').map((layer, index) => // Draggable layers
                    <SortableLayer
                        {...layer}
                        key={`layer-${index}`}
                        index={index}
                    />
            )}
            {layers.filter(layer => layer.type === 'basemap').map((layer, index) => // Basemaps are not draggable
                <Layer
                    {...layer}
                    key={`layer-${index}`}
                    index={index}
                />
            )}
        </div>
    );
});

const LayersPanel = ({ layers, onSortEnd }) => (
    <SortableLayersList
        layers={layers}
        onSortEnd={onSortEnd}
        useDragHandle={true}
    />
);

export default LayersPanel;


// <AddLayer style={styles.button} />