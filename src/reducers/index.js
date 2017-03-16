import { combineReducers } from 'redux';
import ui from './ui';
import map from './map';
// import layers from './layers';
import basemaps from './basemaps';
import overlays from './overlays';
import editOverlay from './editOverlay';
import dataTable from './dataTable';

export default combineReducers({
    ui,
    map,
    basemaps,
    overlays,
    editOverlay,
    dataTable,
});

