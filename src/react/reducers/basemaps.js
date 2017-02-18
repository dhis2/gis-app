const defaultBasemaps = [{
    id: 'osmLight',
    type: 'basemap',
    layerType: 'basemap',
    title: 'OSM Light',
    img: 'images/layers/osmlight.png',
},{
    id: 'openStreetMap',
    type: 'basemap',
    layerType: 'basemap',
    title: 'OSM Detailed',
    img: 'images/layers/osm.png',
},{
    id: 'googleStreets',
    type: 'basemap',
    layerType: 'basemap',
    title: 'Google Streets',
    img: 'images/layers/googlestreets.png',
},{
    id: 'googleHybrid',
    type: 'basemap',
    layerType: 'basemap',
    title: 'Google Hybrid',
    img: 'images/layers/googlehybrid.jpeg',
},{
    id: 'stamenTerrain',
    type: 'basemap',
    layerType: 'external',
    title: 'Terrain',
    img: 'images/layers/terrain.png',
},{
    id: 'osmDark',
    type: 'basemap',
    layerType: 'external',
    title: 'OSM Dark',
    img: 'images/layers/osmdark.png',
},];

const basemaps = (state = defaultBasemaps, action) => {

    switch (action.type) {

        default:
            return state

    }
};

export default basemaps;