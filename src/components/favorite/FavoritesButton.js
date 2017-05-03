import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

const style = {
    height: 40,
    color: '#fff',
};

const FavoriteButton = ({ onClick }) => (
    <FlatButton label="Favorites" onTouchTap={onClick} style={style} />
);

FavoriteButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default FavoriteButton;