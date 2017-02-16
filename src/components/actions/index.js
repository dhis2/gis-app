let nextLayerId = 0;

export const addLayer = (layer) => ({
    type: 'LAYER_ADD',
    id: nextLayerId++,
    ...layer,
});

export const removeLayer = (id) => ({
    type: 'LAYER_REMOVE',
    id,
});

export const toggleLayerExpand = (id) => ({
    type: 'LAYER_TOGGLE_EXPAND',
    id,
});

export const toggleLayerVisibility = (id) => ({
    type: 'LAYER_TOGGLE_VISIBILITY',
    id,
});

export const changeLayerOpacity = (id, opacity) => ({
    type: 'LAYER_CHANGE_OPACITY',
    id,
    opacity,
});

export const sortLayers = ({oldIndex, newIndex}) => ({
    type: 'LAYERS_SORT',
    oldIndex,
    newIndex,
});

export const openLayersDialog = () => ({
    type: 'LAYERS_DIALOG_OPEN_REQUESTED'
});

export const closeLayersDialog = () => ({
    type: 'LAYERS_DIALOG_CLOSE_REQUESTED'
});

export const basemapSelected = (id, basemap) => ({
    type: 'BASEMAP_SELECTED',
    id,
    basemap,
});