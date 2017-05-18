import React from 'react';
import { render } from 'react-dom';
import storeFactory from './store';
import Root from './components/Root';

const store = storeFactory();

console.log('#######');

render(
    <Root store={store} />,
    document.getElementById('app')
);
