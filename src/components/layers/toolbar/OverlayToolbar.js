import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDataTableIcon from 'material-ui/svg-icons/action/view-list';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import NavigationMoreIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey600 } from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors
import OpacitySlider from './OpacitySlider';
import DownloadMenu from './DownloadMenu';
import OpenAsMenu from './OpenAsMenu';
import './OverlayToolbar.css';

const styles = {
    toolbar: {
        backgroundColor: '#eee',
        height: 32,
        padding: '0 8px',
    },
    button: {
        float: 'left',
        padding: 4,
        width: 32,
        height: 32,
    },
    moreButton: {
        float: 'right',
        padding: 4,
        width: 32,
        height: 32,
        marginRight: -7,
        marginLeft: -5,
    },
    menuList: {
        paddingTop: 0,
        paddingBottom: 0,
    },
};

const OverlayToolbar = ({ layer, onEdit, onRemove, toggleDataTable, onOpacityChange }) => {

    return (
        <Toolbar style={styles.toolbar}>
            <ToolbarGroup>
                {onEdit && layer.type !== 'external' &&
                    <IconButton
                        onClick={() => onEdit(layer)}
                        tooltip="Edit"
                        tooltipPosition="top-center"
                        style={styles.button}
                    >
                        <ContentCreateIcon color={grey600} />
                    </IconButton>
                }

                {layer.type === 'thematic' &&
                    <IconButton
                        onClick={() => toggleDataTable(layer.id)}
                        tooltip="Data table"
                        tooltipPosition="top-center"
                        style={styles.button}
                    >
                        <ActionDataTableIcon color={grey600} />
                    </IconButton>
                }

                <OpacitySlider
                    {...layer}
                    onChange={opacity => onOpacityChange(layer.id, opacity)}
                />
            </ToolbarGroup>

            <ToolbarGroup>
                {onRemove &&
                    <IconButton
                        onClick={onRemove}
                        tooltip="Delete"
                        tooltipPosition="top-center"
                        style={styles.button}
                    >
                        <ActionDeleteIcon color={grey600}/>
                    </IconButton>
                }

                {true === false && //    TODO
                    <IconMenu iconButtonElement={
                        <IconButton
                            tooltip="More"
                            tooltipPosition="top-center"
                            style={styles.moreButton}
                        >
                            <NavigationMoreIcon color={grey600} />
                        </IconButton>
                    } listStyle={styles.menuList}>
                        <OpenAsMenu {...layer} />
                        <DownloadMenu {...layer} />
                    </IconMenu>
                }
            </ToolbarGroup>
        </Toolbar>
    )
};

OverlayToolbar.propTypes = {
    layer: PropTypes.object,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onDataTableShow: PropTypes.func,
    onOpacityChange: PropTypes.func,
};

export default OverlayToolbar;
