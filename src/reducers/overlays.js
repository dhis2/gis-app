const defaultOverlays = [{
    layerType: 'event',
    title: 'Events',
    img: 'images/layers/events.png',
    opacity: 0.95,
},{
    layerType: 'facility',
    title: 'Facilities',
    img: 'images/layers/facilities.png',
    visible: true,
    opacity: 1,
    expanded: true,
    loaded: false,
},{
    layerType: 'thematic',
    title: 'Thematic',
    img: 'images/layers/thematic.png',
    visible: true,
    opacity: 0.8,
    expanded: true,
    loaded: false,
},{
    layerType: 'boundary',
    title: 'Boundaries',
    img: 'images/layers/boundaries.png',
    opacity: 1,
    visible: true,
    expanded: true,
    loaded: false,
},{
    layerType: 'external',
    title: 'Labels',
    img: 'images/layers/labels.png',
    opacity: 0.9,
    visible: true,
    expanded: false,
    loaded: false,
    config: {
        mapService: 'XYZ',
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',
        attribution: '&copy; <a href=\\\"http://www.openstreetmap.org/copyright\\\">OpenStreetMap</a>, <a href=\\\"https://carto.com/attributions\\\">CARTO</a>',
        mapLayerPosition: 'OVERLAY',
        imageFormat: 'PNG',
    },
},{
    layerType: 'earthEngine',
    title: 'Population density',
    img: 'images/layers/population.png',
    subtitle: '2010',
    opacity: 0.9,
    visible: true,
    expanded: true,
    loaded: false,
    /*
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
    */
},{
    layerType: 'earthEngine',
    title: 'Elevation',
    img: 'images/layers/elevation.png',
    opacity: 0.9,
    visible: true,
    expanded: false,
    loaded: false,
},{
    layerType: 'earthEngine',
    title: 'Temperature',
    img: 'images/layers/temperature.png',
    opacity: 0.9,
    visible: true,
    expanded: false,
    loaded: false,
},{
    layerType: 'earthEngine',
    title: 'Landcover',
    img: 'images/layers/landcover.png',
    opacity: 0.9,
    visible: true,
    expanded: true,
    loaded: false,
},{
    layerType: 'earthEngine',
    title: 'Precipitation',
    img: 'images/layers/precipitation.png',
    subtitle: '26 - 28 Nov. 2016',
    expanded: true,
    visible: true,
    opacity: 0.9,
    loaded: false,
    /*
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
    */
},{
    layerType: 'earthEngine',
    title: 'Nighttime lights',
    img: 'images/layers/nighttime.png',
    opacity: 0.9,
    visible: true,
    expanded: false,
    loaded: false,

},];

const overlays = (state = defaultOverlays, action) => {

    switch (action.type) {

        default:
            return state

    }
};

export default overlays;