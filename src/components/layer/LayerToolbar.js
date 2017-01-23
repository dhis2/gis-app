import React from 'react';
import IconButton from 'material-ui/IconButton';
import ContentCreateIcon from 'material-ui/svg-icons/action/visibility';
import ActionFilterListIcon from 'material-ui/svg-icons/content/filter-list';
import ActionSearchIcon from 'material-ui/svg-icons/action/search';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import Slider from 'material-ui/Slider';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

const styles = {
    toolbar: {
        backgroundColor: '#eee',
        height: 36,
        borderBottom: '1px solid #aaa'
    },
    button: {
        float: 'left',
        padding: 6,
        width: 36,
        height: 36,
    },
    rightButton: {
        float: 'right',
        padding: 6
    },
    slider: {
        float: 'left',
        width: 100
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
            <Slider defaultValue={0.9} style={styles.slider} />
            <IconButton tooltip="Delete" style={styles.button}>
                <ActionDeleteIcon color={grey600} />
            </IconButton>
        </div>
    );
}
