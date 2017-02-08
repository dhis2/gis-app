import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import App from './app/App';

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


/*
const GisApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
)
*/


// console.log('store', store.getState()); // Returns current state

// console.log('store', store.dispatch({ type: 'ADD_LAYER' })); // Returns current state


// store.dispatch({ type: 'ADD_LAYER' });


//console.log('state', store.getState()); // Returns current state


//export default GisApp;