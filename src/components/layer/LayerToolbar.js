import React, { PropTypes } from 'react'
import IconButton from 'material-ui/IconButton';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDataTableIcon from 'material-ui/svg-icons/action/view-list';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import Slider from 'material-ui/Slider';
import { grey600 } from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

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

const LayerToolbar = ({ id, data, opacity, onEdit, onRemove, onDataTableShow, onOpacityChange}) => (
    <div style={styles.toolbar}>
        {onEdit &&
            <IconButton onClick={onEdit} tooltip="Edit" tooltipPosition="top-center" style={styles.button}>
                <ContentCreateIcon color={grey600} />
            </IconButton>
        }

        {onDataTableShow &&
            <IconButton onClick={() => onDataTableShow(id, data)} tooltip="Data table" tooltipPosition="top-center" style={styles.button}>
                <ActionDataTableIcon color={grey600} />
            </IconButton>
        }

        {onOpacityChange &&
            <Slider
                defaultValue={opacity}
                onChange={(evt, opacity) => onOpacityChange(id, opacity)}
                style={styles.sliderContainer}
                sliderStyle={styles.slider}
            />
        }
        {onRemove &&
            <IconButton onClick={onRemove} tooltip="Delete" tooltipPosition="top-center" style={styles.rightButton}>
                <ActionDeleteIcon color={grey600}/>
            </IconButton>
        }
    </div>
);

LayerToolbar.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array,
    opacity: PropTypes.number,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onDataTableShow: PropTypes.func,
    onOpacityChange: PropTypes.func,
};

LayerToolbar.defaultProps = {
    data: [],
    opacity: 1,
};

export default LayerToolbar;
