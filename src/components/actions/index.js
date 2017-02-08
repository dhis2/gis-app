let nextLayerId = 0;

export const addLayer = ({title}) => ({
    type: 'ADD_LAYER',
    id: nextLayerId++,
    title,
});


export const sortLayers = ({oldIndex, newIndex}) => ({
    type: 'SORT_LAYERS',
    oldIndex,
    newIndex,
})
