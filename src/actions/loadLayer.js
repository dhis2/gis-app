// TODO: Move to another folder

import facilityLoader from './facilityLoader';

const loadLayer = (layer, callback) =>  {

    // TODO: check for layer type
    facilityLoader(layer, callback);

}

export default loadLayer;