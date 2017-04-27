import React, { PropTypes } from 'react';
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