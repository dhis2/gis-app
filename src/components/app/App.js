import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import Menu from './Menu';
import AddLayerButton from '../../containers/AddLayerButton';
import AddLayerDialog from '../../containers/AddLayerDialog';
import LayersList from '../../containers/LayersList';
import Map from './Map';
import DataTable from '../../containers/DataTable';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
    app: {
        height: 750,
        border: '1px solid #eee',
    },
    map: {
        float: 'right',
        width: 'calc(100% - 300px)',
        height: 'calc(100% - 80px)',
        textAlign: 'center',
        paddingTop: 330,
        boxSizing: 'border-box',
    }
};

const App = () => (
    <MuiThemeProvider>
        <div style={styles.app}>
            <Header />
            <Menu />
            <AddLayerButton />
            <AddLayerDialog />
            <LayersList />
            <Map style={styles.map} />
            <DataTable />
        </div>
    </MuiThemeProvider>
)

export default App;