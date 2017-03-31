import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

// https://github.com/callemall/material-ui/issues/2866
const anchorEl = document.getElementById('context-menu');

const ContextMenu = props => {

    const popupStyle = {
        // backgroundColor: 'red',
    };

    anchorEl.style.left = '400px';
    anchorEl.style.top = '400px';

    // console.log('ContextMenu', anchorEl, props);

    return (
        <Popover
            open={false}
            style={popupStyle}
            anchorEl={anchorEl}
        >
            <Menu>
                <MenuItem primaryText="Drill up one level" leftIcon={<RemoveRedEye />} />
                <MenuItem primaryText="Drill down one level" />
                <MenuItem primaryText="Show information" />
                <MenuItem primaryText="Show longitude/latitude" />
            </Menu>
        </Popover>
    );
};

export default ContextMenu;