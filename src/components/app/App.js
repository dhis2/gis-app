import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppMenu from '../../containers/AppMenu';
import AddLayerDialog from '../../containers/AddLayerDialog';
import FavoritesDialog from '../../containers/FavoritesDialog';
import LayersPanel from '../../containers/LayersPanel';
import Map from '../../containers/Map';
import BottomPanel from "../../containers/BottomPanel";
import OverlayEdit from '../../containers/OverlayEdit';
import ContextMenu from '../../containers/ContextMenu';
import OrgUnitDialog from '../../containers/OrgUnitDialog';
import RelocateDialog from '../../containers/RelocateDialog';
import MapProvider from '../map/MapProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
        <MapProvider>
            <div id="dhis-gis-container">
                <AppMenu />
                <AddLayerDialog />
                <FavoritesDialog />
                <LayersPanel />
                <Map />
                <BottomPanel />
                <OverlayEdit />
                <ContextMenu />
                <OrgUnitDialog />
                <RelocateDialog />
            </div>
        </MapProvider>
    </MuiThemeProvider>
);

export default App;
