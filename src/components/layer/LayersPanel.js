import React, { PropTypes } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Layer from '../../containers/Layer';

const styles = {
    float: 'left',
    padding: 8,
    boxSizing: 'border-box',
    width: 300,
    height: 'calc(100% - 88px)',
    backgroundColor: '#fafafa',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'scroll',
};

const SortableLayer = SortableElement(Layer);

const SortableLayersList = SortableContainer(({layers}) => (
    <div style={styles}>
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
    )
);

const LayersPanel = ({ layers, onSortEnd }) => (
    <SortableLayersList
        layers={layers}
        onSortEnd={onSortEnd}
        useDragHandle={true}
    />
);

export default LayersPanel;
