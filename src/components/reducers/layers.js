import {arrayMove} from 'react-sortable-hoc';

const layer = (state, action) => {
    switch (action.type) {
        case 'ADD_LAYER':
            // console.log('Add Layer', action);
            return {
                id: String(action.id),
                title: action.title,
                subtitle: action.subtitle,
                opacity: action.opacity,
                expanded: action.expanded,
            };
        case 'TOGGLE_LAYER_EXPAND':
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

const layers = (state = [], action) => {

    switch (action.type) {
        case 'SORT_LAYERS':
            return arrayMove(state, action.oldIndex, action.newIndex);
        case 'ADD_LAYER':
            return [
                ...state,
                layer(undefined, action)
            ];
        case 'TOGGLE_LAYER_EXPAND':
            return state.map(l =>
                layer(l, action)
            );
        default:
            return state
    }
};

export default layers