import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Basemap from '../../containers/Basemap';
import Overlay from '../../containers/Overlay';

const styles = {
    position: 'absolute',
    top: 88,
    height: 'auto',
    bottom: 0,
    //padding: 8,
    backgroundColor: '#fafafa',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)', // h-shadow v-shadow blur spread
    zIndex: 1049,
};

const SortableLayer = SortableElement(Overlay);

const SortableLayersList = SortableContainer(({layers}) => (
    <div>
        {layers.map((layer, index) => { // Draggable layers - last layer on top
            return (
                <Overlay
                    {...layer}
                    key={`layer-${index}`}
                    index={index}
                />
            )
            }
        )}
    </div>
));

const LayersPanel = ({ basemap, basemaps, overlays, onSortEnd }) => {
    const selectedBasemap = basemaps.filter(b => b.id === basemap.id)[0];

    // console.log('layerspanel', basemap, overlays);

    return (
        <Drawer containerStyle={styles} width={300}>
            <SortableLayersList layers={overlays} onSortEnd={onSortEnd} useDragHandle={true} />
            <Basemap {...selectedBasemap} {...basemap} basemaps={basemaps} />
        </Drawer>
    );
}


export default LayersPanel;
