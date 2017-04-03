import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';

// https://github.com/callemall/material-ui/issues/2866
const anchorEl = document.getElementById('context-menu');

const ContextMenu = props => {

    console.log('ContextMenu x', props.pos);

    const style = {
        menu: {
            //overflowX: 'hidden',
            //width: '176px', // TODO: Make more felxible for longer translations
        },
        list: {
            paddingTop: 4,
            paddingBottom: 4,
        },
        menuItem: {
            fontSize: 12,
            lineHeight: '24px',
            minHeight: '24px',
        },
        menuItemInner: {
            padding: '0 10px 0 40px',
        },
        icon: {
            margin: 0,
            left: 8,
        }
    };

    if (props.pos) {
        anchorEl.style.left = props.pos[0] + 'px'; // '400px';
        anchorEl.style.top = props.pos[1] + 'px'; // '400px';
    }

    // console.log('ContextMenu', anchorEl, props);

    return (
        <Popover
            open={props.pos ? true : false}
            style={style.popover}
            anchorEl={anchorEl}
            onRequestClose={props.onRequestClose}
        >
            <Menu autoWidth={true} style={style.menu} listStyle={style.list} menuItemStyle={style.menuItem} >
                <MenuItem primaryText="Drill up one level" innerDivStyle={style.menuItemInner} leftIcon={<RemoveRedEye style={style.icon}/>} />
                <MenuItem primaryText="Drill down one level" innerDivStyle={style.menuItemInner} leftIcon={<RemoveRedEye style={style.icon}/>} />
                <MenuItem primaryText="Show information" innerDivStyle={style.menuItemInner} leftIcon={<RemoveRedEye style={style.icon}/>} />
                <MenuItem primaryText="Show longitude/latitude" innerDivStyle={style.menuItemInner} leftIcon={<RemoveRedEye style={style.icon}/>} />
            </Menu>
        </Popover>
    );
};

export default ContextMenu;