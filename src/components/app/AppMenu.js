import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TableIcon from 'material-ui/svg-icons/image/grid-on';
import ChartIcon from 'material-ui/svg-icons/editor/show-chart';
import MapIcon from 'material-ui/svg-icons/maps/map';
import FlatButton from 'material-ui/FlatButton';
import { HEADER_HEIGHT } from '../../constants/layout';

const styles = {
    toolbar: {
        position: 'absolute',
        width: '100%',
        height: HEADER_HEIGHT,
        backgroundColor: 'rgb(39, 102, 150)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.227451)',
        zIndex: 1050,
    },
    button: {
        color: '#fff',
        height: 40,
        margin: 0,
    },
};

const AppMenu = ({ openOverlaysDialog, openFavoritesDialog }) => (
    <Toolbar
        style={styles.toolbar}
        className="dhis-gis-menu"
    >
        <ToolbarGroup firstChild={true}>
            <FlatButton
                label="Add layer"
                onTouchTap={openOverlaysDialog}
                style={styles.button}
            />
            <FlatButton
                label="Favorites"
                onTouchTap={openFavoritesDialog}
                style={styles.button}
            />
            <FlatButton
                label="Share"
                disabled={true}
                style={styles.button}
            />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true} style={styles.lastToolbar}>
            <FlatButton
                label="About"
                style={styles.button}
            />
            <FlatButton
                label="Home"
                style={styles.button}
            />
        </ToolbarGroup>
    </Toolbar>
);

export default AppMenu;