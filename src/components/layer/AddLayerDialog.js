import React from 'react';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';

const layers = [{
    img: 'images/layers/events.png',
    title: 'Events',
    opacity: 0.95,
    expanded: false,
    visible: true,
},{
    img: 'images/layers/facilities.png',
    title: 'Facilities',
    subtitle: 'Facility type',
    expanded: true,
    visible: true,
    opacity: 1,
    legend: {
        items: [{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/08.png',
            name : 'CHP',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/16.png',
            name : 'CHC',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/10.png',
            name : 'MCHP',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/14.png',
            name : 'Clinic',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/05.png',
            name : 'Hospital',
        }]
    },
},{
    img: 'images/layers/thematic.png',
    layerType: 'Thematic',
    title: 'ANC 3 Coverage',
    subtitle: '2017',
    expanded: true,
    visible: true,
    opacity: 0.8,
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
},{
    img: 'images/layers/boundaries.png',
    title: 'Boundaries',
    opacity: 1,
    visible: true,
},{
    img: 'images/layers/labels.png',
    title: 'Labels',
    opacity: 0.9,
    visible: true,
},{
    img: 'images/layers/population.png',
    title: 'Population density',
    opacity: 0.9,
    visible: true,
},{
    img: 'images/layers/elevation.png',
    title: 'Elevation',
    opacity: 0.9,
    visible: true,
},{
    img: 'images/layers/temperature.png',
    title: 'Temperature',
    opacity: 0.9,
    visible: true,
},{
    img: 'images/layers/landcover.png',
    title: 'Landcover',
    opacity: 0.9,
    visible: true,
},{
    img: 'images/layers/precipitation.png',
    title: 'Precipitation',
    subtitle: '26 - 28 Nov. 2016',
    expanded: true,
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
    }
},{
    img: 'images/layers/nighttime.png',
    title: 'Nighttime lights',
    opacity: 0.9,
    visible: true,
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
                        title={layer.layerType || layer.title}
                        className="dhis-layer-tile"
                        style={styles.gridTile}
                        titleStyle={styles.title}
                        onClick={() => props.onLayerSelect(layer)}
                    >
                        <img src={layer.img} style={styles.image} />
                    </GridTile>
                ))}
            </GridList>
        </Dialog>
    );
}