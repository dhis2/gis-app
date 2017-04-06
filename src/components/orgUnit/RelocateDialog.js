import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';

const style = {
    position: 'absolute',
    top: 96,
    right: 8,
    width: 150,
    padding: 8,
    zIndex: 1100,
};

const RelocateDialog = props => {
    console.log('RelocateDialog', props);




    if (props.feature) {

        const mapContainer = document.getElementsByClassName('leaflet-container');

        console.log(mapContainer);

        mapContainer.style.cursor = 'crosshair';

        // TODO: Need access to the map object!


        return (
            <Paper
                style={style}
                title="Dialog With Actions"
            >
                Click the map where you want to relocate facility <strong>{props.feature.properties.name}</strong>
            </Paper>
        );
    }

    return null;
};




export default RelocateDialog;

