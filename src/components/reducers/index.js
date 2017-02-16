import { combineReducers } from 'redux';
import ui from './ui';
import layers from './layers';

export default combineReducers({
    ui,
    layers,
});

