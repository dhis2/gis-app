import { combineReducers } from 'redux';
import ui from './ui';
import map from './map';
import basemaps from './basemaps';
import overlays from './overlays';
import layerEdit from './layerEdit';
import dataTable from './dataTable';
import contextMenu from './contextMenu';
import orgUnit from './orgUnit';
import relocate from './relocate';
import loading from './loading';
import system from './system';
import user from './user';
import programs from './programs';
import programStages from './programStages';
import programStageDataElements from './programStageDataElements';
import programTrackedEntityAttributes from './programTrackedEntityAttributes';
import optionSets from './optionSets';

export default combineReducers({
    ui,
    map,
    basemaps,
    overlays,
    layerEdit,
    dataTable,
    contextMenu,
    orgUnit,
    relocate,
    loading,
    system,
    user,
    programs,
    programStages,
    programStageDataElements,
    programTrackedEntityAttributes,
    optionSets
});