import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import CollapseIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ExpandIcon from 'material-ui/svg-icons/navigation/chevron-right';
import { grey800 } from 'material-ui/styles/colors';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Basemap from '../../containers/Basemap';
import Overlay from '../../containers/Overlay';
import { HEADER_HEIGHT, LAYERS_PANEL_WIDTH } from '../../constants/layout';

const styles = {
    collapse: { // Collapse button
        position: 'absolute',
        top: 8,
        right: -24,
        width: 24,
        height: 40,
        padding: 0,
        background: '#fff',
        boxShadow: '3px 1px 5px -1px rgba(0, 0, 0, 0.2)',
    },
    expand: { // Expand button
        position: 'absolute',
        top: 8,
        right: -32,
        width: 24,
        height: 40,
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

const LayersPanel = (props) => {
    const {
        basemap,
        basemaps,
        overlays,
        sortOverlays,
        layersPanelOpen,
        openLayersPanel,
        closeLayersPanel
    } = props;
    const selectedBasemap = basemaps.filter(b => b.id === basemap.id)[0];
    let toggleButton;

    if (layersPanelOpen) {
        toggleButton = (<IconButton onClick={closeLayersPanel} style={styles.collapse} disableTouchRipple={true}>
            <CollapseIcon color={grey800} />
        </IconButton>);
    } else {
        toggleButton = (<IconButton onClick={openLayersPanel} style={styles.expand} disableTouchRipple={true}>
            <ExpandIcon color={grey800} />
        </IconButton>);
    }

    const style = {
        position: 'absolute',
        top: HEADER_HEIGHT,
        height: 'auto',
        bottom: 0,
        backgroundColor: '#fafafa',
        boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
        zIndex: 1049,
        overflow: 'visible',
    };

    return (
        <Drawer
            open={layersPanelOpen}
            containerStyle={style}
            width={LAYERS_PANEL_WIDTH}
        >
            {toggleButton}
            <SortableLayersList
                overlays={overlays}
                onSortEnd={sortOverlays}
                useDragHandle={true}
            />
            <Basemap
                {...selectedBasemap}
                {...basemap}
                basemaps={basemaps}
            />
        </Drawer>
    );
};

export default LayersPanel;
