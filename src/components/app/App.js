import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import Menu from './Menu';

import AddLayerDialog from '../../containers/AddLayerDialog';
import FavoriteDialog from '../../containers/FavoriteDialog';
import LayersList from '../../containers/LayersList';
import Map from '../../containers/Map';
import DataTable from '../../containers/DataTable';
import OverlayEdit from '../../containers/OverlayEdit';
import ContextMenu from '../../containers/ContextMenu';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
    mapContainer: {
        position: 'absolute',
        top: 88,
        left: 300,
        right: 0,
        bottom: 0,
    }
};

const App = () => (
    <MuiThemeProvider>
        <div>
            <Header />
            <Menu />
            <AddLayerDialog />
            <FavoriteDialog />
            <LayersList />
            <div style={styles.mapContainer}>
                <Map />
            </div>
            <OverlayEdit />
            <ContextMenu/>
            <DataTable />
        </div>
    </MuiThemeProvider>
)

export default App;