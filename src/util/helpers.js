import store from '../store';

const defaultKeyAnalysisDisplayProperty = 'displayName';

const displayPropertyMap = {
    name: 'displayName',
    displayName: 'displayName',
    shortName: 'displayShortName',
    displayShortName: 'displayShortName',
};

// TODO: Do once and make avaialble in d2 settings?
// export const getDisplayPropertyUrl = (name) => (displayPropertyMap[name] || 'displayName') + '~rename(name)';

export const getDisplayPropertyUrl = () => {
    console.log('###', store.getState().userSettings.keyAnalysisDisplayProperty);
    const keyAnalysisDisplayProperty = displayPropertyMap[store.getState().userSettings.keyAnalysisDisplayProperty || defaultKeyAnalysisDisplayProperty];
    return keyAnalysisDisplayProperty + '~rename(name)';
};


/*
const defaultKeyAnalysisDisplayProperty = 'displayName';
const displayPropertyMap = {
    name: 'displayName',
    displayName: 'displayName',
    shortName: 'displayShortName',
    displayShortName: 'displayShortName'
};
let namePropertyUrl;
let contextPath;
let keyUiLocale;
let keyAnalysisDisplayProperty;
let dateFormat;

init.userAccount.settings.keyUiLocale = init.userAccount.settings.keyUiLocale || defaultKeyUiLocale;
init.userAccount.settings.keyAnalysisDisplayProperty = displayPropertyMap[init.userAccount.settings.keyAnalysisDisplayProperty] || defaultKeyAnalysisDisplayProperty;

// local vars
contextPath = init.contextPath;
keyUiLocale = init.userAccount.settings.keyUiLocale;
keyAnalysisDisplayProperty = init.userAccount.settings.keyAnalysisDisplayProperty;
namePropertyUrl = keyAnalysisDisplayProperty + '~rename(name)';
*/















