import React from 'react';

const basemaps = [{
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


const styles = {
    root: {
        overflowY: 'scroll',
    },
    layer: {
        float: 'left',
        width: 120,
        marginLeft: 13,
        cursor: 'pointer',
        boxSizing: 'border-box',
        height: 90,
    },
    name: {
        fontSize: 12,
        color: '#333',
        paddingTop: 4,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    imageContainer: {
        position: 'relative',
        height: 56,
        width: 120,
        marginTop: 4,
    },
    image: {
        position: 'absolute',
        clip: 'rect(64px, 256px, 192px, 0)', // top, right, bottom, left
        width: 120,
        top: -64,
    },
};

export default function Basemaps(props) {
    return (
        <div style={styles.root}>
                {basemaps.map((basemap, index) => {

                    const borderStyle = Object.assign({
                        outline: (basemap.id === props.id ? '3px solid orange' : '1px solid #999'),
                    }, styles.imageContainer);

                    return (
                        <div key={`basemap-${index}`} style={styles.layer} onClick={() => props.onBasemapSelect(props.id, basemap)}>
                            <div style={borderStyle}>
                                <img src={basemap.img} style={styles.image} />
                            </div>
                            <div style={styles.name}>{basemap.title}</div>
                        </div>
                    )
                })}
        </div>
    )
}
