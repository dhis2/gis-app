// TODO: Refactoring needed
import GIS from './core/index.js';
import app from './app/index.js';
import appInit from './app-init';

// New React stuff
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
// import createLogger from 'redux-logger'
import reducer from './reducers';
import App from './components/app/App';

import '../scss/app.scss';

// const loggerMiddleware = createLogger(); // TODO: Check usage!

// http://redux.js.org/docs/advanced/AsyncActions.html
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // TODO: Remove from prod
    applyMiddleware(
        thunk, // lets us dispatch() functions
        // loggerMiddleware // neat middleware that logs actions
    ),
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
