import * as types from '../constants/actionTypes';

const defaultOverlays = [{
    type: 'event',
    preview: true,
    title: 'Events Preview',
    img: 'images/layers/events.png',
    opacity: 0.95,

    program: {
        id: 'eBAyeGv0exc',
        name: 'Inpatient morbidity and mortality'
    },
    programStage: {
        id: 'Zj7UnCAulEk',
        name: 'Single-Event Inpatient morbidity and mortality'
    },

    columns: [{
        dimension: 'qrur9Dvnyt5',
        name: 'Age in years',
        filter: 'LT:50'
    }],
    /*
    rows: [{
        dimension: 'ou',
        items: [{
            id: 'ImspTQPwCqd'
        }]
    }],
    */
    filters: [{
        dimension: 'pe',
        items: [{
            id: 'LAST_YEAR'
        }]
    }],
    startDate: '2016-08-29',
    endDate: '2017-08-29',
    eventClustering: true,
    eventPointColor: '#333333',
    eventPointRadius: 6,
    editCounter: 1,
    /*
     legend: {
     description: 'Period: 2016-08-29 – 2017-08-29',
     items: [{
     radius: 6,
     color: '#333333',
     name: 'Event'
     }]
     }
     */
},{
    type: 'event',
    title: 'Events',
    img: 'images/layers/events.png',
    opacity: 0.95,
},{
    type: 'facility',
    preview: true,
    title: 'Facilities Preview',
    img: 'images/layers/facilities.png',
    opacity: 1,
    rows: [{
        dimension: 'ou',
        items:[{
            id: 'LEVEL-4'
        }]
    }]
},{
    type: 'facility',
    title: 'Facilities',
    img: 'images/layers/facilities.png',
    opacity: 1,
},{
    type: 'thematic',
    title: 'Thematic',
    img: 'images/layers/thematic.png',
    opacity: 0.8,
},{
    type: 'boundary',
    title: 'Boundaries',
    img: 'images/layers/boundaries.png',
    opacity: 1,
},{
    type: 'earthEngine',
    title: 'Population density',
    img: 'images/layers/population.png',
    subtitle: '2010',
    opacity: 0.9,
},{
    type: 'earthEngine',
    title: 'Elevation',
    img: 'images/layers/elevation.png',
    opacity: 0.9,
},{
    type: 'earthEngine',
    title: 'Temperature',
    img: 'images/layers/temperature.png',
    opacity: 0.9,
},{
    type: 'earthEngine',
    title: 'Landcover',
    img: 'images/layers/landcover.png',
    opacity: 0.9,
},{
    type: 'earthEngine',
    title: 'Precipitation',
    img: 'images/layers/precipitation.png',
    subtitle: '26 - 28 Nov. 2016',
    opacity: 0.9,
},{
    type: 'earthEngine',
    title: 'Nighttime lights',
    img: 'images/layers/nighttime.png',
    opacity: 0.9,
}];

const overlays = (state = defaultOverlays, action) => {

    switch (action.type) {

        case types.EXTERNAL_OVERLAY_ADD:
            return [
                ...state,
                action.payload,
            ];

        case types.EXTERNAL_OVERLAY_REMOVE:
            return state.filter(overlay => overlay.id !== action.id);

        default:
            return state

    }
};

export default overlays;
