import React from 'react';
import PropTypes from 'prop-types';
import AppWithD2 from 'd2-ui/lib/app/AppWithD2.component';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MapProvider from '../map/MapProvider';
import AppMenu from '../../containers/AppMenu';
import AddLayerDialog from '../../containers/AddLayerDialog';
import FavoritesDialog from '../../containers/FavoritesDialog';
import LayersPanel from '../../containers/LayersPanel';
import LayersToggle from '../../containers/LayersToggle';
import Map from '../../containers/Map';
import BottomPanel from "../../containers/BottomPanel";
import LayerEdit from '../../containers/LayerEdit';
import ContextMenu from '../../containers/ContextMenu';
import OrgUnitDialog from '../../containers/OrgUnitDialog';
import RelocateDialog from '../../containers/RelocateDialog';
import AboutDialog from '../../containers/AboutDialog';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = ({ d2 }) => (
    <AppWithD2 d2={d2}>
        <MuiThemeProvider>
            <MapProvider>
                <div id="dhis-gis-container">
                    <AppMenu />
                    <AddLayerDialog />
                    <FavoritesDialog />
                    <LayersPanel />
                    <LayersToggle />
                    <Map />
                    <BottomPanel />
                    <LayerEdit />
                    <ContextMenu />
                    <OrgUnitDialog />
                    <RelocateDialog />
                    <AboutDialog />

                </div>
            </MapProvider>
        </MuiThemeProvider>
    </AppWithD2>
);

export default App;

