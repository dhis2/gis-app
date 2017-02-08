import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import Menu from './Menu';
import LayersList from '../containers/LayersList';
import Map from './Map';

const styles = {
    app: {
        height: 750,
        border: '1px solid #eee',
    },
    layers: {
        float: 'left',
        width: 300,
        height: 'calc(100% - 88px)',
        backgroundColor: '#fafafa',
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
            <LayersList />
            <Map style={styles.map} />
        </div>
    </MuiThemeProvider>
)

export default App;