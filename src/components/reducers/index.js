import { combineReducers } from 'redux'
import layers from './layers'
// import visibilityFilter from './visibilityFilter'


const layer = (state, action) => {
    switch (action.type) {
        case 'ADD_LAYER':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'TOGGLE_LAYER':
            if (state.id !== action.id) {
                return state
            }

            return {
                ...state,
                completed: !state.completed
            }
        default:
            return state
    }
}


const gisApp = combineReducers({
    layers,
    // visibilityFilter
})

export default gisApp