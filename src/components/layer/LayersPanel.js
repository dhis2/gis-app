import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import CollapseIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ExpandIcon from 'material-ui/svg-icons/navigation/chevron-right';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Basemap from '../../containers/Basemap';
import Overlay from '../../containers/Overlay';
import { grey800 } from 'material-ui/styles/colors';

const style = {
    drawer: {
        position: 'absolute',
        top: 40,
        height: 'auto',
        bottom: 0,
        // borderRight: '1px solid #333',
        backgroundColor: '#fafafa',
        boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
        zIndex: 1049,
        overflow: 'visible',
    },
    collapse: { // Collapse button
        position: 'absolute',
        top: 12,
        right: -24,
        width: 24,
        height: 32,
        padding: 0,
        background: '#fff',
        boxShadow: '3px 1px 5px -1px rgba(0, 0, 0, 0.2)',
    },
    expand: { // Expand button
        position: 'absolute',
        top: 12,
        right: -32,
        width: 24,
        height: 32,
        padding: '0 0 0 1px',
        background: '#fff',
        boxShadow: '3px 1px 5px -1px rgba(0, 0, 0, 0.2)',
    },
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


// https://github.com/callemall/material-ui/issues/4752
const LayersPanel = ({ basemap, basemaps, overlays, sortOverlays, ui, openLayersPanel, closeLayersPanel }) => {
    const selectedBasemap = basemaps.filter(b => b.id === basemap.id)[0];
    let toggleButton;

    if (ui.layersPanelOpen) {
        toggleButton = (<IconButton onClick={closeLayersPanel} style={style.collapse} disableTouchRipple={true}>
            <CollapseIcon color={grey800} />
        </IconButton>);
    } else {
        toggleButton = (<IconButton onClick={openLayersPanel} style={style.expand} disableTouchRipple={true}>
            <ExpandIcon color={grey800} />
        </IconButton>);
    }

    return (
        <Drawer open={ui.layersPanelOpen} containerStyle={style.drawer} width={300}>
            {toggleButton}
            <SortableLayersList overlays={overlays} onSortEnd={sortOverlays} useDragHandle={true} />
            <Basemap {...selectedBasemap} {...basemap} basemaps={basemaps} />
        </Drawer>
    );
}


export default LayersPanel;
