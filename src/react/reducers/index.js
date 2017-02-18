import { combineReducers } from 'redux';
import ui from './ui';
import layers from './layers';
import basemaps from './basemaps';

export default combineReducers({
    ui,
    layers,
    basemaps,
});

