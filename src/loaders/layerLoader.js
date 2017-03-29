import eventLoader from './eventLoader';
import facilityLoader from './facilityLoader';
import ThematicLoader from './ThematicLoader';
import boundaryLoader from './boundaryLoader';
import earthEngineLoader from './earthEngineLoader';
import externalLoader from './externalLoader';

const layerType = {
    event: eventLoader,
    facility: facilityLoader,
    thematic: ThematicLoader,
    boundary: boundaryLoader,
    earthEngine: earthEngineLoader,
    external: externalLoader,
};

const layerLoader = (layer, callback) =>  {
    const Loader = layerType[layer.type];

    if (Loader) {
        if (layer.type === 'thematic') { // TODO: Remove check when all loaders are classes
            new Loader(layer, callback);
        } else {
            Loader(layer, callback);
        }
    }
};

export default layerLoader;