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
        height: 32,
        paddingLeft: 7
    },
    button: {
        float: 'left',
        padding: 4,
        width: 32,
        height: 32,
    },
    rightButton: {
        float: 'right',
        padding: 4,
        marginRight: 10,
        width: 32,
        height: 32,
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

export default function LayerToolbar(props) {
    return (
        <div style={styles.toolbar}>
            {props.onEdit &&
                <IconButton onClick={props.onEdit} tooltip="Edit" tooltipPosition="top-center" style={styles.button}>
                    <ContentCreateIcon color={grey600} />
                </IconButton>
            }
            {props.onSearch &&
                <IconButton onClick={props.onSearch} tooltip="Search" tooltipPosition="top-center" style={styles.button}>
                    <ActionSearchIcon color={grey600} />
                </IconButton>
            }
            {props.onFilter &&
                <IconButton onClick={props.onFilter} tooltip="Filter" tooltipPosition="top-center" style={styles.button}>
                    <ActionFilterListIcon color={grey600} />
                </IconButton>
            }
            {props.onOpacityChange &&
                <Slider
                    defaultValue={props.opacity}
                    onChange={props.onOpacityChange}
                    style={styles.sliderContainer}
                    sliderStyle={styles.slider}
                />
            }
            {props.onDelete &&
                <IconButton onClick={props.onDelete} tooltip="Delete" tooltipPosition="top-center" style={styles.rightButton}>
                    <ActionDeleteIcon color={grey600}/>
                </IconButton>
            }
        </div>
    );
}


//