import getMap from './getMap.js';
import getInstance from './getInstance.js';
import getLayers from './getLayers.js';
import MapLoader from './MapLoader.js';
import LayerHandlerEvent from './LayerHandlerEvent.js';
import LayerHandlerFacility from './LayerHandlerFacility.js';
import LayerHandlerThematic from './LayerHandlerThematic.js';
import LayerHandlerBoundary from './LayerHandlerBoundary.js';
import LayerHandlerEarthEngine from './LayerHandlerEarthEngine.js';
import LayerHandlerExternal from './LayerHandlerExternal.js';
import ContextMenu from './ContextMenu.js';

// ext config
Ext.Ajax.method = 'GET';

Ext.isIE = (/trident/.test(Ext.userAgent));

Ext.isIE11 = Ext.isIE && (/rv:11.0/.test(Ext.userAgent));

// GIS
export default {
    apiVersion: 26,
    core: {
        instances: [],
        getMap,
        getInstance,
        getLayers,
        MapLoader,
        LayerHandlerEvent,
        LayerHandlerFacility,
        LayerHandlerThematic,
        LayerHandlerBoundary,
        LayerHandlerEarthEngine,
        LayerHandlerExternal,
        ContextMenu,
    },
    i18n: {},
    isDebug: false,
    isSessionStorage: 'sessionStorage' in window && window['sessionStorage'] !== null,
    logg: []
};
