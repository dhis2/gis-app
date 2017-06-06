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

// TODO: Add to function below
function parseOverlay(layer, callback) {
    layer.isLoaded = true;
    layer.isExpanded = true;
    layer.isVisible = true;
    layer.dataFilters = layer.dataFilters || {}; // TODO: Get from Web API?

    callback(layer);
}

export function fetchOverlay(layer) {
    console.log('fetch', layer);

    return new Promise((resolve, reject) => {
        const Loader = layerType[layer.type];

        if (Loader) {
            if (layer.type === 'thematic') { // TODO: Remove check when all loaders are classes
                new Loader(layer, config => parseOverlay(config, resolve));
            } else {
                Loader(layer, config => parseOverlay(config, resolve));
            }
        } else {
            reject('Unknown layer type.')
        }
    });
}
