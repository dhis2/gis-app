import isString from 'd2-utilizr/lib/isString';

const externalLoader = (layer, callback) =>  {
    if (isString(layer.config)) { // From database as favorite
        layer = JSON.parse(layer.config);
    }

    layer.title = layer.name;



    // TODO: Add legend support

    console.log('externalLoader', layer);

    callback(layer);
};

export default externalLoader;