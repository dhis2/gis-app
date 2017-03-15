const externalLoader = (layer, callback) =>  {
    console.log('externalLoader', JSON.stringify(layer.config));

    callback(layer);
};

export default externalLoader;