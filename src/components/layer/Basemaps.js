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
    gridList: {
        padding: '8px 16px 16px 16px',
    },
    gridTile: {
        cursor: 'pointer',
    },
    title: {
        fontSize: 12,
    },
};

export default function Basemaps(props) {
    return (
        <div style={styles.root}>
            <GridList cellHeight={100} style={styles.gridList} >
                {basemaps.map((basemap, index) => (
                    <GridTile
                        key={`basemap-${index}`}
                        title={basemap.title}
                        className="dhis-basemap-tile"
                        style={styles.gridTile}
                        titleStyle={styles.title}
                        onClick={() => {console.log('clicked')}}
                    >
                        <img src={basemap.img} />
                    </GridTile>
                ))}
            </GridList>
        </div>


    )
}
