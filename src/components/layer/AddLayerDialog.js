import React from 'react';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';

const layers = [{
    img: 'images/layers/events.png',
    title: 'Events',
},{
    img: 'images/layers/facilities.png',
    title: 'Facilities',
},{
    img: 'images/layers/thematic.png',
    title: 'Thematic analysis',
},{
    img: 'images/layers/boundaries.png',
    title: 'Boundaries',
},{
    img: 'images/layers/labels.png',
    title: 'Labels',
},{
    img: 'images/layers/population.png',
    title: 'Population density',
},{
    img: 'images/layers/elevation.png',
    title: 'Elevation',
},{
    img: 'images/layers/temperature.png',
    title: 'Temperature',
},{
    img: 'images/layers/landcover.png',
    title: 'Landcover',
},{
    img: 'images/layers/precipitation.png',
    title: 'Precipitation',
},{
    img: 'images/layers/nighttime.png',
    title: 'Nighttime lights',
},];


const styles = {
    gridList: {
        // padding: '8px 16px 16px 16px',
    },
    gridTile: {
        //border: '1px solid #555',
        cursor: 'pointer',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: 14,
        color: '#333',
    },
    image: {
        border: '1px solid #555',
        width: '99%',
        height: 'auto',
    },
};


export default function AddLayerDialog(props) {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={props.handleClose}
        />,
    ];

    return (
        <Dialog
            title="Add new layer"
            actions={actions}
            modal={true}
            open={false}
            {...props}
            onRequestClose={props.handleClose}
        >
            <GridList cellHeight={200} cols={4} padding={16} style={styles.gridList} >
                {layers.map((layer, index) => (
                    <GridTile
                        key={`basemap-${index}`}
                        title={layer.title}
                        className="dhis-layer-tile"
                        style={styles.gridTile}
                        titleStyle={styles.title}
                        onClick={() => props.onLayerSelect(layer.title)}
                    >
                        <img src={layer.img} style={styles.image} />
                    </GridTile>
                ))}
            </GridList>
        </Dialog>
    );
}