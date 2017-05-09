import isString from 'd2-utilizr/lib/isString';

const externalLoader = (layer, callback) =>  {
    if (isString(layer.config)) { // From database as favorite
        layer.config = JSON.parse(layer.config);
        layer.title = layer.config.name;
    }

    layer.type = 'external';
    layer.isLoaded = true;

    // TODO: Add legend support

    callback(layer);
};

export default externalLoader;