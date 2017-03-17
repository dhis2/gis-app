import React from 'react';
import AddLayerButton from '../../containers/AddLayerButton';
import FavoriteButton from '../../containers/FavoriteButton';

const styles = {
    position: 'absolute',
    width: '100%',
    height: 40,
    backgroundColor: 'rgb(228, 228, 228)',
    zIndex: 1050,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.227451)', // h-shadow v-shadow blur spread
    //boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
};

const Menu = () => (
    <div style={styles}>
        <AddLayerButton />
        <FavoriteButton />
    </div>
);

export default Menu;