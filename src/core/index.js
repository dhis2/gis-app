import getMap from './getMap.js';
import getInstance from './getInstance.js';
import getLayers from './getLayers.js';
import MapLoader from './MapLoader.js';
import LayerHandlerEvent from './LayerHandlerEvent.js';
import LayerHandlerFacility from './LayerHandlerFacility.js';
import LayerHandlerThematic from './LayerHandlerThematic.js';
import LayerHandlerBoundary from './LayerHandlerBoundary.js';
import FeaturePopup from './FeaturePopup.js';
import FeatureContextMenu from './FeatureContextMenu.js';

// ext config
Ext.Ajax.method = 'GET';

Ext.isIE = (/trident/.test(Ext.userAgent));

Ext.isIE11 = Ext.isIE && (/rv:11.0/.test(Ext.userAgent));

// gis
window.GIS = {
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
        FeaturePopup,
        FeatureContextMenu,
    },
    i18n: {},
    isDebug: false,
    isSessionStorage: 'sessionStorage' in window && window['sessionStorage'] !== null,
    logg: []
};
