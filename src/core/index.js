import getInstance from './getInstance.js';

Ext.Ajax.method = 'GET';

Ext.isIE = (/trident/.test(Ext.userAgent));
Ext.isIE11 = Ext.isIE && (/rv:11.0/.test(Ext.userAgent));

window.GIS = {
    apiVersion: 26,
    core: {
        instances: [],
        getInstance,
    },
    i18n: {},
    isDebug: false,
    isSessionStorage: 'sessionStorage' in window && window['sessionStorage'] !== null,
    logg: []
};

export default GIS;
