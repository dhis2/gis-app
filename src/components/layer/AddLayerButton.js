import React, { PropTypes } from 'react';
//import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
//import ContentAddIcon from 'material-ui/svg-icons/content/add';

const style = {
    height: 40
};

const AddLayerButton = ({ onClick }) => (
    <FlatButton label="Add layer" onTouchTap={onClick} style={style} />
);

AddLayerButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddLayerButton;