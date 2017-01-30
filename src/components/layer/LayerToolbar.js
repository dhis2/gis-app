import React from 'react';
import IconButton from 'material-ui/IconButton';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionFilterListIcon from 'material-ui/svg-icons/content/filter-list';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import Slider from 'material-ui/Slider';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

const styles = {
    toolbar: {
        backgroundColor: '#eee',
        height: 34,
        paddingLeft: 7
    },
    button: {
        float: 'left',
        padding: 5,
        width: 34,
        height: 34,
    },
    rightButton: {
        float: 'right',
        padding: 5,
        marginRight: 10,
        width: 34,
        height: 34,
    },
    sliderContainer: {
        float: 'left',
        width: 100,
        marginBottom: 0
    },
    slider: {
        margin: 8
    }
};

export default function LayerToolbar() {
    return (
        <div style={styles.toolbar}>
            <IconButton tooltip="Edit" style={styles.button}>
                <ContentCreateIcon color={grey600} />
            </IconButton>
            <IconButton tooltip="Search" style={styles.button}>
                <ActionSearchIcon color={grey600} />
            </IconButton>
            <IconButton tooltip="Filter" style={styles.button}>
                <ActionFilterListIcon color={grey600} />
            </IconButton>
            <Slider defaultValue={0.9} style={styles.sliderContainer} sliderStyle={styles.slider} />
            <IconButton tooltip="Delete" style={styles.rightButton}>
                <ActionDeleteIcon color={grey600} />
            </IconButton>
        </div>
    );
}


//