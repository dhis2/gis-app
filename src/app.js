// TODO: Refactoring needed
import GIS from './core/index.js';
import app from './app/index.js';
import appInit from './app-init';
import '../scss/app.scss';

// New React stuff
import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import storeFactory from './store';

const store = storeFactory();

render(
    <Root store={store} />,
    document.getElementById('app')
);
