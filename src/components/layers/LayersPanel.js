import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Basemap from '../../containers/Basemap';
import Overlay from '../../containers/Overlay';
import { HEADER_HEIGHT, LAYERS_PANEL_WIDTH } from '../../constants/layout';

const SortableLayer = SortableElement(Overlay);

// Draggable layers - last layer on top
const SortableLayersList = SortableContainer(({ overlays }) => (
    <div>
        {overlays.map((overlay, index) => (
            <SortableLayer
                key={overlay.id}
                index={index}
                layer={overlay}
            />
        ))}
    </div>
));

const style = {
    position: 'absolute',
    top: HEADER_HEIGHT,
    height: 'auto',
    bottom: 0,
    backgroundColor: '#fafafa',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
    zIndex: 1049,
    overflowX: 'hidden',
    overflowY: 'auto',
};

const LayersPanel = ({ layersPanelOpen, basemap, basemaps, overlays, sortOverlays }) => (
    <Drawer
        open={layersPanelOpen}
        containerStyle={style}
        width={LAYERS_PANEL_WIDTH}
    >
        <SortableLayersList
            overlays={overlays}
            onSortEnd={sortOverlays}
            useDragHandle={true}
        />
        <Basemap
            {...basemap}
            basemaps={basemaps}
        />
    </Drawer>
);

LayersPanel.propTypes = {
    layersPanelOpen: PropTypes.bool.isRequired,
    basemap: PropTypes.object.isRequired,
    basemaps: PropTypes.array.isRequired,
    overlays: PropTypes.array.isRequired,
    sortOverlays: PropTypes.func.isRequired,
};

export default LayersPanel;