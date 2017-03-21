import eventLoader from './eventLoader';
import facilityLoader from './facilityLoader';
import thematicLoader from './thematicLoader';
import boundaryLoader from './boundaryLoader';
import earthEngineLoader from './earthEngineLoader';
import externalLoader from './externalLoader';

const layerType = {
    event: eventLoader,
    facility: facilityLoader,
    thematic: thematicLoader,
    boundary: boundaryLoader,
    earthEngine: earthEngineLoader,
    external: externalLoader,
};

const loadLayer = (layer, callback) =>  {
    if (layerType[layer.type]) {
        layerType[layer.type](layer, callback);
    }
};

export default loadLayer;