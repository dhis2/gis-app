Ext.onReady( function() {

    // ext config
    Ext.Ajax.method = 'GET';

    Ext.isIE = (/trident/.test(Ext.userAgent));

    Ext.isIE11 = Ext.isIE && (/rv:11.0/.test(Ext.userAgent));

    // gis
    GIS = {
        core: {
            instances: []
        },
        i18n: {},
        isDebug: false,
        isSessionStorage: 'sessionStorage' in window && window['sessionStorage'] !== null,
        logg: []
    };

});
