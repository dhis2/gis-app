import { combineReducers } from 'redux';
import ui from './ui';
import map from './map';
import basemaps from './basemaps';
import overlays from './overlays';
import editOverlay from './editOverlay';
import dataTable from './dataTable';
import contextMenu from './contextMenu';
import orgUnit from './orgUnit';
import loading from './loading';

export default combineReducers({
    ui,
    map,
    basemaps,
    overlays,
    editOverlay,
    dataTable,
    contextMenu,
    orgUnit,
    loading,
});