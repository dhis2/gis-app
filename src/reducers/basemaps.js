const defaultBasemaps = [{
    id: 'osmLight',
    type: 'basemap',
    layerType: 'basemap',
    title: 'OSM Light',
    img: 'images/layers/osmlight.png',
    config: {
        type: 'tileLayer',
        url: '//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    },
},{
    id: 'openStreetMap',
    type: 'basemap',
    layerType: 'basemap',
    title: 'OSM Detailed',
    img: 'images/layers/osm.png',
    config: {
        type: 'tileLayer',
        url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
},{
    id: 'googleStreets',
    type: 'basemap',
    layerType: 'basemap',
    title: 'Google Streets',
    img: 'images/layers/googlestreets.png',
    config: {
        type: 'googleLayer',
        style: 'ROADMAP',
        apiKey: 'AIzaSyBjlDmwuON9lJbPMDlh_LI3zGpGtpK9erc',
    }
},{
    id: 'googleHybrid',
    type: 'basemap',
    layerType: 'basemap',
    title: 'Google Hybrid',
    img: 'images/layers/googlehybrid.jpeg',
    config: {
        type: 'googleLayer',
        style: 'HYBRID',
        apiKey: 'AIzaSyBjlDmwuON9lJbPMDlh_LI3zGpGtpK9erc',
    },
},{
    id: 'stamenTerrain',
    type: 'basemap',
    layerType: 'external',
    title: 'Terrain',
    img: 'images/layers/terrain.png',
    config: {
        type: 'tileLayer',
        url: '//stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://stamen.com">Stamen Design</a>, <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
},{
    id: 'osmDark',
    type: 'basemap',
    layerType: 'external',
    title: 'OSM Dark',
    img: 'images/layers/osmdark.png',
    config: {
        type: 'tileLayer',
        url: '//cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    },
},];

const basemaps = (state = defaultBasemaps, action) => {

    switch (action.type) {

        default:
            return state

    }
};

export default basemaps;