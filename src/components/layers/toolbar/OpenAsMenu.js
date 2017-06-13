import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowIcon from 'material-ui/svg-icons/navigation-arrow-drop-right';
import { grey600 } from 'material-ui/styles/colors';

const styles = {
    icon: {
        margin: 4,
    },
    menuItem: {
        lineHeight: '32px',
        minHeight: 32,
        fontSize: 14,
    },
};

const OpenAsMenu = ({ id }) => (
    <MenuItem
        primaryText='Open as ...'
        rightIcon={<NavigationArrowIcon color={grey600} style={styles.icon} />}
        menuItems={[
            <MenuItem primaryText="Pivot" style={styles.menuItem} />,
            <MenuItem primaryText="Chart" style={styles.menuItem} />,
        ]}
        style={styles.menuItem}
    />
);

OpenAsMenu.propTypes = {
    id: PropTypes.string.isRequired,
};

export default OpenAsMenu
