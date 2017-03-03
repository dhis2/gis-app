// TODO: Refactoring needed
import GIS from './core/index.js';
import app from './app/index.js';
import appInit from './app-init';

// New React stuff
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import App from './components/app/App';

import '../scss/app.scss';

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // TODO: Remove from prod
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
