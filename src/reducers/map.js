import {arrayMove} from 'react-sortable-hoc';

const defaultState = {
    latitude: 8.4,
    longitude: -11.8,
    zoom: 8,
    basemap: {
        id: 'osmLight',
        visible: true,
        expanded: true,
        opacity: 1,
        subtitle: 'Basemap',
    },
    overlays: [],
};


const basemap = (state, action) => {

    switch (action.type) {

        case 'BASEMAP_SELECTED':
            if (state.id === action.id) { // No change
                return state;
            }

            return {
                ...state,
                id: action.id,
            };

        case 'BASEMAP_CHANGE_OPACITY':
            return {
                ...state,
                opacity: action.opacity,
            };

        case 'BASEMAP_TOGGLE_EXPAND':
            return {
                ...state,
                expanded: !state.expanded,
            };

        case 'BASEMAP_TOGGLE_VISIBILITY':
            return {
                ...state,
                visible: !state.visible,
            };

        default:
            return state;

    }
};


const overlay = (state, action) => {

    switch (action.type) {

        case 'OVERLAY_ADD':
            return {
                ...action,
                id: String(action.id),
                index: action.index,
                type: action.layerType,
            };

        case 'OVERLAY_CHANGE_OPACITY':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                opacity: action.opacity,
            };

        case 'OVERLAY_TOGGLE_VISIBILITY':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                visible: !state.visible,
            };

        case 'OVERLAY_TOGGLE_EXPAND':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                expanded: !state.expanded,
            };

        default:
            return state;

    }
};

const map = (state = defaultState, action) => {

    switch (action.type) {

        case 'BASEMAP_SELECTED':
        case 'BASEMAP_CHANGE_OPACITY':
        case 'BASEMAP_TOGGLE_EXPAND':
        case 'BASEMAP_TOGGLE_VISIBILITY':
            return {
                ...state,
                basemap: basemap(state.basemap, action),
            };

        case 'OVERLAY_ADD':
            console.log('OVERLAY_ADD');

            return { // TODO: Best way?
                ...state,
                overlays: [
                    overlay(undefined, action),
                    ...state.overlays,
                ]
            };

        case 'OVERLAY_REMOVE':
            return {
                ...state,
                overlays: state.overlays.filter(overlay => overlay.id !== action.id)
            };

        case 'OVERLAY_SORT':
            return {
                ...state,
                overlays: arrayMove(state.overlays, action.oldIndex, action.newIndex)
            };

        case 'OVERLAY_CHANGE_OPACITY':
        case 'OVERLAY_TOGGLE_VISIBILITY':
        case 'OVERLAY_TOGGLE_EXPAND':
            return {
                ...state,
                overlays: state.overlays.map(l => overlay(l, action))
            };

        default:
            return state;

    }
};

export default map;