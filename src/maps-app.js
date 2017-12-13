// TODO: Refactoring needed
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import debounce from 'lodash/fp/debounce';
import { init, config, getUserSettings, getManifest, getInstance as getD2 } from 'd2/lib/d2';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';


import GIS from './core/index.js';
import app from './app/index.js';
import appInit from './app-init';
import '../scss/app.scss';


// import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import configOptionStore from './store/configOptionStore'; // TODO: Needend?

import Root from './components/Root';

// import storeFactory from './store';
import store from './store';
// import { loadPrograms } from './actions/programs';
import { loadOrgUnitTree } from './actions/orgUnits';
import { loadExternalLayers } from './actions/externalLayers';
import { resizeScreen } from './actions/ui';

const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.TRACE);

const a = document.createElement('a');
function getAbsoluteUrl(url) {
    a.href = url;
    return a.href;
}

// const store = storeFactory();

const configI18n = (userSettings) => {
    i18next
        .use(XHR)
        .init({
            returnEmptyString: false,
            fallbackLng: false,
            keySeparator: '|',
            backend: {
                loadPath: '/i18n/{{lng}}.json'
            }
        }, (err, t) => {
            const uiLocale = userSettings.keyUiLocale;
            if (uiLocale && uiLocale !== 'en') {
                i18next.changeLanguage(uiLocale);
            }
        });
};


// Temporary fix to know that initial data is loaded

// store.dispatch(translateRelativePeriods());
store.dispatch(loadOrgUnitTree());

GIS.onLoad = () => {
    store.dispatch(loadExternalLayers());
};

// Window resize listener: http://stackoverflow.com/questions/35073669/window-resize-react-redux

window.addEventListener('resize', debounce(150, () => store.dispatch(resizeScreen(window.innerWidth, window.innerHeight))));

getManifest('manifest.webapp')
    .then((manifest) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api/27`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);

        // Include all API endpoints in use by this app
        config.schemas = [
            'dataElement',
            'dataElementGroup',
            'dataSet',
            'externalMapLayer',
            'legendSet',
            'indicator',
            'indicatorGroup',
            'optionSet',
            'organisationUnit',
            'organisationUnitGroup',
            'organisationUnitGroupSet',
            'organisationUnitLevel',
            'program',
            'programStage',
        ];
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then((d2) => {
        // App init
        // log.debug('D2 initialized', d2);

        if (!d2.currentUser.authorities.has('F_SYSTEM_SETTING')) {
            document.write(i18next.t('Access denied'));
            return;
        }

        // Load alternatives
        const api = d2.Api.getApi();
        const apiBaseUrl = getAbsoluteUrl(api.baseUrl);
        const baseUrl = apiBaseUrl.substr(0, apiBaseUrl.lastIndexOf('/api/'));

        Promise.all([
            api.get('locales/ui'),
            api.get('userSettings', { useFallback: false }),
        ]).then((results) => {
            // Locales
            const locales = (results[0] || []).map(locale => ({ id: locale.locale, displayName: locale.name }));

            const userSettingsNoFallback = results[1];

            configOptionStore.setState({
                locales,
                userSettingsNoFallback,
            });
            log.debug('Got settings options:', configOptionStore.getState());

            // Load current system settings and configuration
            // settingsActions.load();

            getD2().then(d2 => {
              render(
                <Root d2={d2} store={store} />,
                document.getElementById('app')
              );
            });


        });

    }, (err) => {
        log.error('Failed to initialize D2:', JSON.stringify(err));
        document.write(`D2 initialization error: ${err}`);
    });
