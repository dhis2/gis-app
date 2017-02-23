import {arrayMove} from 'react-sortable-hoc';

const layer = (state, action) => {
    switch (action.type) {

        case 'LAYER_ADD':
            return {
                ...action,
                id: String(action.id),
                type: action.layerType,
            };

        case 'LAYER_CHANGE_OPACITY':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                opacity: action.opacity,
            };

        case 'LAYER_TOGGLE_EXPAND':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                expanded: !state.expanded,
            };

        case 'LAYER_TOGGLE_VISIBILITY':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                visible: !state.visible,
            };

        default:
            return state;

    }
};


const basemaps = (state, action) => {
    switch (action.type) {

        case 'BASEMAP_SELECTED':
            if (state.id !== action.id) {
                return state;
            }

            const basemap = action.basemap;

            return {
                ...state,
                id: basemap.id,
                type: basemap.type,
                layerType: basemap.layerType,
                title: basemap.title,
                config: basemap.config,
            };

        default:
            return state;

    }
};

// TODO: clone from basemaps
const defaultLayers = [{
    id: 'osmLight',
    type: 'basemap',
    layerType: 'basemap',
    title: 'OSM Light',
    subtitle: 'Basemap',
    visible: true,
    expanded: true,
    opacity: 1,
    config: {
        type: 'tileLayer',
        url: '//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    },
}];

const layers = (state = defaultLayers, action) => {

    switch (action.type) {

        case 'LAYERS_SORT':
            return arrayMove(state, action.oldIndex, action.newIndex);

        case 'LAYER_ADD':
            return [
                ...state,
                layer(undefined, action)
            ];

        case 'LAYER_REMOVE':
            return state.filter(layer => layer.id !== action.id);

        case 'LAYER_CHANGE_OPACITY':
            return state.map(l =>
                layer(l, action)
            );

        case 'LAYER_TOGGLE_EXPAND':
            return state.map(l =>
                layer(l, action)
            );

        case 'LAYER_TOGGLE_VISIBILITY':
            return state.map(l =>
                layer(l, action)
            );

        case 'BASEMAP_SELECTED':
            return state.map(l =>
                basemaps(l, action)
            );

        default:
            return state

    }
};

export default layers;