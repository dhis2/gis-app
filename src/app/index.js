import colorRamp from '../custom/ColorScale.js';
import extendInstance from './extendInstance.js';
import createExtensions from './createExtensions.js';
import WidgetWindow from './WidgetWindow.js';
import LayerWidgetEvent from './LayerWidgetEvent.js';
import LayerWidgetFacility from './LayerWidgetFacility.js';
import LayerWidgetThematic from './LayerWidgetThematic.js';
import LayerWidgetBoundary from './LayerWidgetBoundary.js';
import LayerWidgetEarthEngine from './LayerWidgetEarthEngine.js';
import LayerWidgetExternal from './LayerWidgetExternal.js';
import FavoriteWindow from './FavoriteWindow.js';
import SharingWindow from './SharingWindow.js';
import DownloadWindow from './DownloadWindow.js';
import AboutWindow from './AboutWindow.js';
import InterpretationWindow from './InterpretationWindow.js';

GIS.app = {
    extendInstance,
    createExtensions,
    WidgetWindow,
    LayerWidgetEvent,
    LayerWidgetFacility,
    LayerWidgetThematic,
    LayerWidgetBoundary,
    LayerWidgetEarthEngine,
    LayerWidgetExternal,
    FavoriteWindow,
    SharingWindow,
    DownloadWindow,
    AboutWindow,
    InterpretationWindow,
};

export default GIS.app;
