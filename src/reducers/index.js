import { combineReducers } from 'redux';
import ui from './ui';
import layers from './layers';
import basemaps from './basemaps';
import overlays from './overlays';

export default combineReducers({
    ui,
    layers,
    basemaps,
    overlays,
});

