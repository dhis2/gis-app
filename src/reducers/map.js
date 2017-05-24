import * as types from '../constants/actionTypes';
import {arrayMove} from 'react-sortable-hoc';

const defaultState = {
    bounds: [[-34.9, -18.7], [35.9, 50.2]],
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

        case types.BASEMAP_SELECTED:
            if (state.id === action.id) { // No change
                return state;
            }

            return {
                ...state,
                id: action.id,
            };

        case types.BASEMAP_CHANGE_OPACITY:
            return {
                ...state,
                opacity: action.opacity,
            };

        case types.BASEMAP_TOGGLE_EXPAND:
            return {
                ...state,
                expanded: !state.expanded,
            };

        case types.BASEMAP_TOGGLE_VISIBILITY:
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

        case types.OVERLAY_LOAD_REQUESTED:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                isLoading: true,
            };

        case types.OVERLAY_UPDATE:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...action.payload,
            };

        case types.OVERLAY_CHANGE_OPACITY:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                opacity: action.opacity,
            };

        case types.OVERLAY_TOGGLE_VISIBILITY:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                visible: !state.visible,
            };

        case types.OVERLAY_TOGGLE_EXPAND:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                expanded: !state.expanded,
            };

        case types.ORGANISATION_UNIT_SELECT:
        case types.ORGANISATION_UNIT_UNSELECT:
        case types.ORGANISATION_UNIT_COORDINATE_CHANGE:
            if (state.id !== action.layerId) {
                return state;
            }

            return {
                ...state,
                data: state.data.map(l => orgUnit(l, action))
            };

        case types.ORGANISATION_UNITS_FILTER:
            return {
                ...state,
                valueFilter: action.filter,
            };

        default:
            return state;

    }
};

const orgUnit = (state, action) => {

    switch (action.type) {
        case types.ORGANISATION_UNIT_SELECT:
            if (state.id !== action.featureId) {
                return state;
            }

            return {
                ...state,
                isSelected: true,
            };

        case types.ORGANISATION_UNIT_UNSELECT:
            if (state.id !== action.featureId) {
                return state;
            }

            return {
                ...state,
                isSelected: false,
            };

        case types.ORGANISATION_UNIT_COORDINATE_CHANGE:
            if (state.id !== action.featureId) {
                return state;
            }

            return {
                ...state,
                geometry: {
                    ...state.geometry,
                    coordinates: action.coordinate
                },
            };

        default:
            return state;

    }

};

const map = (state = defaultState, action) => {

    switch (action.type) {
        case types.MAP_SET:
            return {
                ...defaultState, // TODO: Not sure why needed
                ...action.payload
            };

        case types.MAP_COORDINATE_OPEN:
            return {
                ...state,
                coordinatePopup: action.payload,
            };

        case types.MAP_COORDINATE_CLOSE:
            return {
                ...state,
                coordinatePopup: null,
            };

        case types.BASEMAP_SELECTED:
        case types.BASEMAP_CHANGE_OPACITY:
        case types.BASEMAP_TOGGLE_EXPAND:
        case types.BASEMAP_TOGGLE_VISIBILITY:
            return {
                ...state,
                basemap: basemap(state.basemap, action),
            };

        case types.OVERLAY_ADD:
            return {
                ...state,
                overlays: [
                    action.payload,
                    ...state.overlays,
                ],
            };

        case types.OVERLAY_ADD_DATA:
            return {
                ...state,
            };

        case types.OVERLAY_LOAD:
            return {
                ...state,
            };

        case types.OVERLAY_REMOVE:
            return {
                ...state,
                overlays: state.overlays.filter(overlay => overlay.id !== action.id)
            };

        case types.OVERLAY_SORT:
            return {
                ...state,
                overlays: arrayMove(state.overlays, action.oldIndex, action.newIndex)
            };

        case types.OVERLAY_LOAD_REQUESTED:
        case types.OVERLAY_UPDATE:
        case types.OVERLAY_EDIT:
        case types.OVERLAY_CHANGE_OPACITY:
        case types.OVERLAY_TOGGLE_VISIBILITY:
        case types.OVERLAY_TOGGLE_EXPAND:
        case types.ORGANISATION_UNIT_SELECT:
        case types.ORGANISATION_UNIT_UNSELECT:
        case types.ORGANISATION_UNIT_COORDINATE_CHANGE:
        case types.ORGANISATION_UNITS_FILTER:
            return {
                ...state,
                overlays: state.overlays.map(l => overlay(l, action))
            };

        default:
            return state;

    }
};

export default map;