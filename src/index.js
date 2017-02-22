import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import App from './components/app/App';
import map from 'gis-api/src/';

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


/*
const div = document.createElement('div');
div.style.width = '100%';
div.style.height = '100%';

window.d2map = map(div);
*/

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
