import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import Menu from './Menu';

import AddLayerDialog from '../../containers/AddLayerDialog';
import LayersList from '../../containers/LayersList';
import Map from '../../containers/Map';
import DataTable from '../../containers/DataTable';
import LayersEdit from '../../containers/LayersEdit';

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
            <LayersList />
            <LayersEdit />
            <div style={styles.mapContainer}>
                <Map />
            </div>
            <DataTable />
        </div>
    </MuiThemeProvider>
)

export default App;