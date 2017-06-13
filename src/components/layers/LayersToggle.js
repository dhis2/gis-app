import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import CollapseIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ExpandIcon from 'material-ui/svg-icons/navigation/chevron-right';
import { grey800 } from 'material-ui/styles/colors';
import { HEADER_HEIGHT, LAYERS_PANEL_WIDTH } from '../../constants/layout';

const style = {
    position: 'absolute',
    top: HEADER_HEIGHT + 18,
    left: LAYERS_PANEL_WIDTH,
    width: 24,
    height: 40,
    padding: 0,
    background: '#fff',
    boxShadow: '3px 1px 5px -1px rgba(0, 0, 0, 0.2)',
    zIndex: 1100,
};

const LayersToggle = ({ isOpen, openLayersPanel, closeLayersPanel }) => (isOpen ?
    <IconButton onClick={closeLayersPanel} style={style} disableTouchRipple={true}>
        <CollapseIcon color={grey800} />
    </IconButton>
:
    <IconButton onClick={openLayersPanel} style={{...style, left: 0}} disableTouchRipple={true}>
        <ExpandIcon color={grey800} />
    </IconButton>
);

LayersToggle.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    openLayersPanel: PropTypes.func.isRequired,
    closeLayersPanel: PropTypes.func.isRequired,
};

export default LayersToggle;
