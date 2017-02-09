let nextLayerId = 0;

export const addLayer = (layer) => ({
    type: 'ADD_LAYER',
    id: nextLayerId++,
    ...layer,
});

export const removeLayer = (id) => ({
    type: 'REMOVE_LAYER',
    id,
});

export const toggleLayerExpand = (id) => ({
    type: 'TOGGLE_LAYER_EXPAND',
    id,
});

export const toggleLayerVisibility = (id) => ({
    type: 'TOGGLE_LAYER_VISIBILITY',
    id,
});

export const changeLayerOpacity = (id, opacity) => ({
    type: 'CHANGE_LAYER_OPACITY',
    id,
    opacity,
});

export const sortLayers = ({oldIndex, newIndex}) => ({
    type: 'SORT_LAYERS',
    oldIndex,
    newIndex,
});

