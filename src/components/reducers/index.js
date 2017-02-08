import { combineReducers } from 'redux'
import layers from './layers'
// import visibilityFilter from './visibilityFilter'

/*
const gisApp = combineReducers({
    layers,
    // visibilityFilter
})

export default gisApp
*/


const testState = {
    name: 'My map',
    layers: [{
        id: '1',
        title: 'ANC 3 Coverage',
        subtitle: '2017',
        opacity: 0.8,
        expanded: false,
        legend: {
            items: [{
                color: '#ffffb2',
                name: 'Low',
                range: '0 - 40 (0)'
            },{
                color: '#fed976',
                name : 'Medium',
                range: '40 - 60 (1)',
            },{
                color: '#feb24c',
                name : 'Medium plus',
                range: '60 - 70 (1)',
            },{
                color: '#fd8d3c',
                name : 'High',
                range: '70 - 80 (0)',
            },{
                color: '#f03b20',
                name : 'High plus',
                range: '80 - 90 (4)',
            },{
                color: '#bd0026',
                name : 'Great',
                range: '90 - 120 (5)',
            }]
        }
    }, {
        id: '2',
        title: 'Facilitites',
        subtitle: 'Facility type',
        opacity: 0.9,
        visible: false,
        expanded: false,
        legend: {
            items: [{
                image: 'https://play.dhis2.org/dev/images/orgunitgroup/08.png',
                name : 'CHP',
            },{
                image: 'https://play.dhis2.org/dev/images/orgunitgroup/16.png',
                name : 'CHC',
            },{
                image: 'https://play.dhis2.org/dev/images/orgunitgroup/10.png',
                name : 'MCHP',
            },{
                image: 'https://play.dhis2.org/dev/images/orgunitgroup/14.png',
                name : 'Clinic',
            },{
                image: 'https://play.dhis2.org/dev/images/orgunitgroup/05.png',
                name : 'Hospital',
            }]
        }
    }, {
        id: '3',
        title: 'Precipitation',
        subtitle: '26 - 28 Nov. 2016',
        opacity: 0.6,
        visible: false,
        expanded: false,
        legend: {
            description: 'Precipitation collected from satellite and weather stations on the ground.',
            unit: 'millimeter',
            items: [{
                color: '#eff3ff',
                range : '0 - 20',
            },{
                color: '#c6dbef',
                range : '20 - 40',
            },{
                color: '#9ecae1',
                range : '40 - 60',
            },{
                color: '#6baed6',
                range : '60 - 80',
            },{
                color: '#3182bd',
                range : '80 - 100',
            },{
                color: '#08519c',
                range : '> 100',
            }],
            source: 'UCSB / CHG / Google Earth Engine',
            sourceUrl: 'https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD',
        }
    }, {
        id: '4',
        type: 'basemap',
        title: 'OSM Light',
        subtitle: 'Basemap',
        opacity: 1,
    }]
};


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

/*
const gisApp = (state = testState, action) => {
    // console.log('reducer', state, action);

    switch (action.type) {
        case 'ADD_LAYER':
            return [
                ...state,
                layer(undefined, action)
            ]
        case 'TOGGLE_LAYER':
            return state.map(t =>
                layer(t, action)
            )
        default:
            return state
    }
};

export default gisApp
*/


const gisApp = combineReducers({
    layers,
    // visibilityFilter
})

export default gisApp