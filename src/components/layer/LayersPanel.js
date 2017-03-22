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

const loading = {}; // TODO: Temp fix

const SortableLayersList = SortableContainer(({layers, loadOverlayRequested, requestOverlayLoad, loadOverlay}) => (
    <div>
        {layers.map((layer, index) => { // Draggable layers - last layer on top

            // console.log('SortableLayersList', index, layer);
            // console.log('LayersPanel is loaded: ', layer.isLoaded, layer.isLoading);

            // console.log('AAAA');

            if (!layer.isLoaded && !layer.isLoading && !loading[layer.id]) {
                loading[layer.id] = true; // TODO: Temp fix
                // requestOverlayLoad(layer.id); // Only able to dispach on action
                loadOverlay(layer);
            }

            // console.log('######', layer);

            return (
                <SortableLayer
                    key={layer.id}
                    index={index}
                    layer={layer}
                />
            )
        })}
    </div>
));

const LayersPanel = ({ basemap, basemaps, overlays, onSortEnd, loadOverlay }) => {
    const selectedBasemap = basemaps.filter(b => b.id === basemap.id)[0];

    return (
        <Drawer containerStyle={styles} width={300}>
            <SortableLayersList layers={overlays} onSortEnd={onSortEnd} loadOverlay={loadOverlay} useDragHandle={true} />
            <Basemap {...selectedBasemap} {...basemap} basemaps={basemaps} />
        </Drawer>
    );
}


export default LayersPanel;
