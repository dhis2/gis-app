import React from 'react';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const basemaps = [{
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
    img: 'images/layers/osmdark.png',
    title: 'Labels',
},{
    img: 'images/layers/osmdark.png',
    title: 'Population density',
},{
    img: 'images/layers/osmdark.png',
    title: 'Elevation',
},{
    img: 'images/layers/osmdark.png',
    title: 'Temperature',
},{
    img: 'images/layers/osmdark.png',
    title: 'Landcover',
},{
    img: 'images/layers/osmdark.png',
    title: 'Precipitation',
},{
    img: 'images/layers/osmdark.png',
    title: 'Nighttime lights',
},];


const styles = {
    gridList: {
        // padding: '8px 16px 16px 16px',
    },
    gridTile: {
        border: '1px solid #555',
        cursor: 'pointer',

    },
    title: {
        fontSize: 12,
    },
};


export default function NewLayerDialog(props) {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={() => {}}
        />,
    ];

    return (
        <Dialog
            title="Add new layer"
            actions={actions}
            modal={true}
            open={false}
            {...props}
            //onRequestClose={this.handleClose}
        >
            <GridList cellHeight={150} cols={4} padding={16} style={styles.gridList} >
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
        </Dialog>
    );
}