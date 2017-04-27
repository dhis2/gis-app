import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Basemap from '../../containers/Basemap';
import Overlay from '../../containers/Overlay';

const styles = {
    position: 'absolute',
    top: 40,
    height: 'auto',
    bottom: 0,
    backgroundColor: '#fafafa',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
    zIndex: 1049,
    overflowX: 'hidden',
};

const SortableLayer = SortableElement(Overlay);

const SortableLayersList = SortableContainer(({overlays, loadOverlayRequested, requestOverlayLoad, getOverlay}) => (
    <div>
        {overlays.map((overlay, index) => { // Draggable layers - last layer on top
            return (
                <SortableLayer
                    key={overlay.id}
                    index={index}
                    layer={overlay}
                />
            )
        })}
    </div>
));

const LayersPanel = ({ basemap, basemaps, overlays, onSortEnd, getOverlay }) => {
    const selectedBasemap = basemaps.filter(b => b.id === basemap.id)[0];

    return (
        <Drawer containerStyle={styles} width={300}>
            <SortableLayersList overlays={overlays} onSortEnd={onSortEnd} useDragHandle={true} />
            <Basemap {...selectedBasemap} {...basemap} basemaps={basemaps} />
        </Drawer>
    );
}


export default LayersPanel;
