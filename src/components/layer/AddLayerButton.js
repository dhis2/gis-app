import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

const style = {
    height: 40,
    color: '#fff',
};

const AddLayerButton = ({ onClick }) => (
    <FlatButton label="Add layer" onTouchTap={onClick} style={style} />
);

AddLayerButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddLayerButton;