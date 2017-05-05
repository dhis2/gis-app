import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Header from './Header';
import Menu from './Menu';
import AddLayerDialog from '../../containers/AddLayerDialog';
import FavoritesDialog from '../../containers/FavoritesDialog';
import LayersList from '../../containers/LayersList';
import Map from '../../containers/Map';
import DataTable from '../../containers/DataTable';
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
                <Menu />
                <AddLayerDialog />
                <FavoritesDialog />
                <LayersList />
                <Map />
                <DataTable />
                <OverlayEdit />
                <ContextMenu />
                <OrgUnitDialog />
                <RelocateDialog />
            </div>
        </MapProvider>
    </MuiThemeProvider>
);

export default App;

/*

 <div className="dhis-gis-map-container">
 <Map />
 </div>

 */