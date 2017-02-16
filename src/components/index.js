import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import App from './app/App';
import { addLayer } from './actions';

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);

// Add default basemap - TODO: Where is best placement?
store.dispatch(addLayer({
    id: 'osmLight',
    layerType: 'basemap',
    title: 'OSM Light',
    subtitle: 'Basemap',
    visible: true,
    expanded: true,
    opacity: 1,
}));

