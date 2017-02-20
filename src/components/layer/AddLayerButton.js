import React, { PropTypes } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

const style = {
    position: 'absolute',
    right: 16,
    bottom: 24,
    zIndex: 10
};

const AddLayerButton = ({ onClick }) => (
    <FloatingActionButton onTouchTap={onClick} style={style}>
        <ContentAddIcon />
    </FloatingActionButton>
);

AddLayerButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddLayerButton;