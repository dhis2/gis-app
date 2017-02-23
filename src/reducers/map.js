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

            return state;

            /*
            return {
                ...state,
                opacity: action.opacity,
            };
            */

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
            return { // TODO: Best way?
                ...state,
                overlays: [
                    ...state.overlays,
                    overlay(undefined, action)
                ]
            };

        case 'OVERLAY_CHANGE_OPACITY':
            console.log(state);

            return state.overlays.map(l =>
                overlay(l, action)
            );

        default:
            return state;

    }
};

export default map;