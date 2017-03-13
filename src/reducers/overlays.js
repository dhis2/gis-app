const defaultOverlays = [{
    layerType: 'event',
    img: 'images/layers/events.png',
    title: 'Events',
    opacity: 0.95,
    expanded: false,
    visible: true,
},{
    layerType: 'facility',
    img: 'images/layers/facilities.png',
    title: 'Facilities',
    visible: true,
    opacity: 1,
    expanded: true,
    loaded: false,
    edit: true,
},{
    layerType: 'thematic',
    img: 'images/layers/thematic.png',
    // title: 'ANC 3 Coverage',
    // subtitle: '2017',
    visible: true,
    opacity: 0.8,
    expanded: false,
    loaded: false,
    edit: true,
    /*
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
    },
    */
},{
    layerType: 'boundary',
    img: 'images/layers/boundaries.png',
    title: 'Boundaries',
    opacity: 1,
    visible: true,
    expanded: false,
},{
    layerType: 'external',
    img: 'images/layers/labels.png',
    title: 'Labels',
    opacity: 0.9,
    visible: true,
    expanded: false,
},{
    layerType: 'earthEngine',
    img: 'images/layers/population.png',
    title: 'Population density',
    subtitle: '2010',
    opacity: 0.9,
    visible: true,
    expanded: false,
    legend: {
        description: 'Population density estimates with national totals adjusted to match UN population division estimates.',
        unit: 'people per km2',
        items: [{
            color: '#ffffd4',
            range : '0 - 20',
        },{
            color: '#fee391',
            range : '20 - 40',
        },{
            color: '#fec44f',
            range : '40 - 60',
        },{
            color: '#fe9929',
            range : '60 - 80',
        },{
            color: '#d95f0e',
            range : '80 - 100',
        },{
            color: '#993404',
            range : '> 100',
        }],
        source: 'WorldPop / Google Earth Engine',
        sourceUrl: 'https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP',
    },
    config: {
        "type": "earthEngine",
        // "pane": "earthEngine",
        "name": "Population density",
        "unit": "people per km<sup>2</sup>",
        "aggregation": "mosaic",
        "mask": true,
        "methods": {
            "multiply": [100]
        },
        "resolution": 100,
        "projection": "EPSG:4326",
        "description": "Population density estimates with national totals adjusted to match UN population division estimates.",
        "attribution": "<a href=\"https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP\" target=\"_blank\">WorldPop</a>",
        "id": "WorldPop/POP",
        "image": 2010,
        "params": {
            "palette": "#ffffd4,#fee391,#fec44f,#fe9929,#d95f0e,#993404",
            "min": 0,
            "max": 100
        },
        "filter": [{
            "type": "eq",
            "arguments": ["year", 2010]
        }, {
            "type": "eq",
            "arguments": ["UNadj", "yes"]
        }]
    },
},{
    layerType: 'earthEngine',
    img: 'images/layers/elevation.png',
    title: 'Elevation',
    opacity: 0.9,
    visible: true,
    expanded: false,
},{
    layerType: 'earthEngine',
    img: 'images/layers/temperature.png',
    title: 'Temperature',
    opacity: 0.9,
    visible: true,
    expanded: false,
},{
    layerType: 'earthEngine',
    img: 'images/layers/landcover.png',
    title: 'Landcover',
    opacity: 0.9,
    visible: true,
    expanded: false,
},{
    layerType: 'earthEngine',
    img: 'images/layers/precipitation.png',
    title: 'Precipitation',
    subtitle: '26 - 28 Nov. 2016',
    expanded: false,
    visible: true,
    opacity: 0.9,
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
    },
    config: {
        type: 'earthEngine',
        name: 'Precipitation',
        unit: 'millimeter',
        band: 'precipitation',
        mask: true,
        description: 'Precipitation collected from satellite and weather stations on the ground.',
        attribution: '<a href=\"https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD\" target=\"_blank\">UCSB/CHG</a>',
        id: 'UCSB-CHG/CHIRPS/PENTAD',
        image: '26 – 31 Jan 2017',
        params: {
            palette: "#eff3ff,#c6dbef,#9ecae1,#6baed6,#4292c6,#2171b5,#084594",
            min: 0,
            max: 100
        },
        filter: [{
            type: 'eq',
            arguments: ['system:index', "20170126"]
        }]
    },
},{
    layerType: 'earthEngine',
    img: 'images/layers/nighttime.png',
    title: 'Nighttime lights',
    opacity: 0.9,
    visible: true,
    expanded: false,
},];

const overlays = (state = defaultOverlays, action) => {

    switch (action.type) {

        default:
            return state

    }
};

export default overlays;