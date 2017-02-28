import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import App from './components/app/App';
import map from 'gis-api/src/';

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
