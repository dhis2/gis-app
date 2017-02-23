let nextOverlayId = 0;


/* BASEMAPS */

export const basemapSelected = (id) => ({
    type: 'BASEMAP_SELECTED',
    id,
});

export const toggleBasemapExpand = () => ({
    type: 'BASEMAP_TOGGLE_EXPAND',
});

export const toggleBasemapVisibility = () => ({
    type: 'BASEMAP_TOGGLE_VISIBILITY',
});

export const changeBasemapOpacity = (opacity) => ({
    type: 'BASEMAP_CHANGE_OPACITY',
    opacity,
});


/* OVERLAYS */

export const addOverlay = (layer) => ({
    type: 'OVERLAY_ADD',
    id: 'overlay-' + nextOverlayId++,
    ...layer,
});

export const removeOverlay = (id) => ({
    type: 'OVERLAY_REMOVE',
    id,
});

export const toggleOverlayExpand = (id) => ({
    type: 'OVERLAY_TOGGLE_EXPAND',
    id,
});

export const toggleOverlayVisibility = (id) => ({
    type: 'OVERLAY_TOGGLE_VISIBILITY',
    id,
});

export const changeOverlayOpacity = (id, opacity) => ({
    type: 'OVERLAY_CHANGE_OPACITY',
    id,
    opacity,
});

export const sortOverlays = ({oldIndex, newIndex}) => ({
    type: 'OVERLAYS_SORT',
    oldIndex,
    newIndex,
});


/* USER INTERFACE */

export const openLayersDialog = () => ({
    type: 'LAYERS_DIALOG_OPEN_REQUESTED',
});

export const closeLayersDialog = () => ({
    type: 'LAYERS_DIALOG_CLOSE_REQUESTED',
});

export const openDataTable = (id, data) => ({
    type: 'DATA_TABLE_OPEN_REQUESTED',
    id,
    data,
});

export const closeDataTable = () => ({
    type: 'DATA_TABLE_CLOSE_REQUESTED',
});
