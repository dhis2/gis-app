import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import appTheme from './app.theme';
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

// injectTapEventPlugin();

// Makes d2 available in all child components
// Not using AppWithD2 from d2-ui because it requires d2 to be a promise
class App extends Component {

    static childContextTypes = {
        d2: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            d2: this.props.d2
        };
    }

    render () {
        return (
            <MuiThemeProvider muiTheme={appTheme}>
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
        )
    }
}

export default App;
