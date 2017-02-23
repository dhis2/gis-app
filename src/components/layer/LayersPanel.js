import React, { PropTypes } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Basemap from '../../containers/Basemap';
import Overlay from '../../containers/Overlay';

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

const SortableLayer = SortableElement(Overlay);

const SortableLayersList = SortableContainer(({layers}) => (
    <div>
        {layers.slice().reverse().map((layer, index) => // Draggable layers - last layer on top
            <SortableLayer
                {...layer}
                key={`layer-${index}`}
                index={index}
            />
        )}
    </div>
));

const LayersPanel = ({ basemap, basemaps, overlays, onSortEnd }) => (
    <div style={styles}>
        <SortableLayersList
            layers={overlays}
            onSortEnd={onSortEnd}
            useDragHandle={true}
        />
        <Basemap
            {...basemaps.filter(b => b.id === basemap.id)[0]}
            {...basemap}
            basemap={true}
        />
    </div>
);

export default LayersPanel;
