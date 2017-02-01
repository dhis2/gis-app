import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';


const basemaps = [{
    img: 'images/basemaps/osmlight.png',
    title: 'OSM Light',
},{
    img: 'images/basemaps/osm.png',
    title: 'OSM Detailed',
},{
    img: 'images/basemaps/googlestreets.png',
    title: 'Google Streets',
},{
    img: 'images/basemaps/googlehybrid.jpeg',
    title: 'Google Hybrid',
},{
    img: 'images/basemaps/terrain.png',
    title: 'Terrain',
},{
    img: 'images/basemaps/osmdark.png',
    title: 'OSM Dark',
},];


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        //width: 500,
        //height: 450,
        overflowY: 'auto',
    },
    image: {
        width: '50%',
        height: '50%',
    }
};

export default function Basemaps(props) {
    return (
        <div style={styles.root}>
            <GridList
                cellHeight={180}
                style={styles.gridList}
            >
                {basemaps.map((basemap, index) => (
                    <GridTile
                        key={`basemap-${index}`}
                        title={basemap.title}
                    >
                        <img src={basemap.img} style={styles.image} />
                    </GridTile>
                ))}
            </GridList>
        </div>


    )
}
