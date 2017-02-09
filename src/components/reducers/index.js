import { combineReducers } from 'redux'
import layers from './layers'
// import visibilityFilter from './visibilityFilter'


const gisApp = combineReducers({
    layers,
    // visibilityFilter
})

export default gisApp