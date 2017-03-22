import isString from 'd2-utilizr/lib/isString';

const externalLoader = (layer, callback) =>  {
    if (isString(layer.config)) { // From database as favorite
        layer.config = JSON.parse(layer.config);
        layer.title = layer.config.name;
    }

    layer.type = 'external';
    layer.isLoaded = true;

    // TODO: Add legend support

    // The current redux thunk setup doesn't work  without an async callback...
    setTimeout(() => {
        callback(layer);
    }, 1000);
};

export default externalLoader;