import eventLoader from './event';
import facilityLoader from './facility';

const layerType = {
    event: eventLoader,
    facility: facilityLoader,
};

const loadLayer = (layer, callback) =>  {

    if (layerType[layer.layerType]) {
        layerType[layer.layerType](layer, callback);
    }

};

export default loadLayer;