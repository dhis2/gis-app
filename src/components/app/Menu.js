import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AddLayerButton from '../../containers/AddLayerButton';
import FavoritesButton from '../../containers/FavoritesButton';
import TableIcon from 'material-ui/svg-icons/image/grid-on';
import ChartIcon from 'material-ui/svg-icons/editor/show-chart';
import MapIcon from 'material-ui/svg-icons/maps/map';

import FlatButton from 'material-ui/FlatButton';

const style = {
    toolbar: {
        position: 'absolute',
        width: '100%',
        height: 40,
        // backgroundColor: 'rgb(228, 228, 228)',
        backgroundColor: 'rgb(39, 102, 150)',
        zIndex: 1050,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.227451)', // h-shadow v-shadow blur spread
        //boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
    },
    button: {
        color: '#fff',
        height: 40,
        margin: 0,
    }
};

const Menu = () => (
    <Toolbar style={style.toolbar} className="dhis-gis-menu">
        <ToolbarGroup firstChild={true}>
            <AddLayerButton />
            <FavoritesButton />
            <FlatButton label="Share" disabled={true} style={style.button} />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <FlatButton label="Table" icon={<TableIcon />} style={style.button} />
            <FlatButton label="Chart" icon={<ChartIcon />} style={style.button} />
            <FlatButton label="Map" icon={<MapIcon />} style={style.button} />
            <FlatButton label="About" style={style.button} />
            <FlatButton label="Home" style={style.button} />
        </ToolbarGroup>
    </Toolbar>
);

export default Menu;