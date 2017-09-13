// TODO: Refactoring needed
import GIS from './core/index.js';
import app from './app/index.js';
import appInit from './app-init';
import '../scss/app.scss';

// New React stuff
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
// import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import configOptionStore from './store/configOptionStore'; // TODO: Needen?

import Root from './components/Root';
import debounce from 'lodash.debounce';
import storeFactory from './store';
import { loadSystemInfo, loadSystemSettings } from './actions/system';
import { loadPrograms } from './actions/programs';
import { fetchExternalLayers } from './actions/externalLayers';
import { resizeScreen } from './actions/ui';

const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.TRACE);

const a = document.createElement('a');
function getAbsoluteUrl(url) {
    a.href = url;
    return a.href;
}

const store = storeFactory();

function configI18n(userSettings) {
    // Sources
    const uiLocale = userSettings.keyUiLocale;

    // TODO
    console.log('userSettings', uiLocale);
}

/*
render(
    <Root store={store} />,
    document.getElementById('app')
);
*/

// Temporary fix to know that initial data is loaded
GIS.onLoad = () => {
    // store.dispatch(loadSystemInfo());
    // store.dispatch(loadSystemSettings());
    // store.dispatch(loadSystemSettings());
    // store.dispatch(fetchExternalLayers());
};

// Window resize listener: http://stackoverflow.com/questions/35073669/window-resize-react-redux
window.addEventListener('resize', debounce(() => store.dispatch(resizeScreen(window.innerWidth, window.innerHeight)), 150));

getManifest('manifest.webapp')
    .then((manifest) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api/27`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);

        config.schemas = [
            'organisationUnit',
        ];
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then((d2) => {
        // App init
        log.debug('D2 initialized', d2);

        if (!d2.currentUser.authorities.has('F_SYSTEM_SETTING')) {
            document.write(d2.i18n.getTranslation('access_denied'));
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
            console.log(results);

            // Locales
            const locales = (results[0] || []).map(locale => ({ id: locale.locale, displayName: locale.name }));

            const userSettingsNoFallback = results[1];

            console.log(locales, userSettingsNoFallback);

            configOptionStore.setState({
                locales,
                userSettingsNoFallback,
            });
            log.debug('Got settings options:', configOptionStore.getState());

            // Load current system settings and configuration
            // settingsActions.load();

            render(
                <Root d2={d2} store={store} />,
                document.getElementById('app')
            );


        });



    });


/*
getManifest('manifest.webapp')
    .then((manifest) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api/26`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);

        config.schemas = [
            'indicatorGroup',
            'dataElementGroup',
            'userGroup',
            'organisationUnitLevel',
            'userRole',
            'organisationUnit',
            'dataApprovalLevel',
            'dataApprovalWorkflow',
            'categoryOptionGroupSet',
            'oAuth2Client',
        ];
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then((d2) => {
        // App init
        log.debug('D2 initialized', d2);

        if (!d2.currentUser.authorities.has('F_SYSTEM_SETTING')) {
            document.write(d2.i18n.getTranslation('access_denied'));
            return;
        }

        // Load alternatives
        const api = d2.Api.getApi();
        const apiBaseUrl = getAbsoluteUrl(api.baseUrl);
        const baseUrl = apiBaseUrl.substr(0, apiBaseUrl.lastIndexOf('/api/'));
        Promise.all([
            d2.models.indicatorGroup.list({ paging: false, fields: 'id,displayName', order: 'displayName:asc' }),
            d2.models.dataElementGroup.list({ paging: false, fields: 'id,displayName', order: 'displayName:asc' }),
            d2.models.userGroup.list({ paging: false, fields: 'id,displayName', order: 'displayName:asc' }),
            d2.models.organisationUnitLevel.list({
                paging: false,
                fields: 'id,level,displayName',
                order: 'level:asc',
            }),
            d2.models.userRole.list({ paging: false, fields: 'id,displayName', order: 'displayName:asc' }),
            d2.models.organisationUnit.list({
                paging: false,
                fields: 'id,displayName',
                filter: ['level:in:[1,2]'],
            }),
            api.get(`${baseUrl}/dhis-web-commons/menu/getModules.action`),
            api.get('system/flags'),
            api.get('system/styles'),
            api.get('locales/ui'),
            api.get('userSettings', { useFallback: false }),
        ]).then((results) => {
            const [
                indicatorGroups,
                dataElementGroups,
                userGroups,
                organisationUnitLevels,
                userRoles,
                organisationUnits] = results;

            // Apps/modules
            const startModules = (results[6].modules || []).map(module => ({
                id: module.defaultAction.substr(0, 3) === '../'
                    ? module.name
                    : `app:${module.name}`,
                displayName: module.displayName || module.name,
            }));

            // Flags
            const flags = (results[7] || []).map(flag => ({ id: flag.key, displayName: flag.name }));
            flags.unshift({ id: 'dhis2', displayName: d2.i18n.getTranslation('no_flag') });

            // Stylesheets
            const styles = (results[8] || []).map(style => ({ id: style.path, displayName: style.name }));

            // Locales
            const locales = (results[9] || []).map(locale => ({ id: locale.locale, displayName: locale.name }));

            const userSettingsNoFallback = results[10];

            configOptionStore.setState({
                indicatorGroups,
                dataElementGroups,
                userGroups,
                organisationUnitLevels,
                userRoles,
                organisationUnits,
                startModules,
                flags,
                styles,
                locales,
                userSettingsNoFallback,
            });
            log.debug('Got settings options:', configOptionStore.getState());

            // Load current system settings and configuration
            settingsActions.load();
        });
    }, (err) => {
        log.error('Failed to initialize D2:', JSON.stringify(err));
        document.write(`D2 initialization error: ${err}`);
    });
*/