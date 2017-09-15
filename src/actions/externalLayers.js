import * as types from '../constants/actionTypes';
import { getInstance as getD2 } from 'd2/lib/d2';
import { addBasemap } from './basemap';

// Add external overlay
export const addExternalOverlay = (layer) => ({
    type: types.EXTERNAL_OVERLAY_ADD,
    payload: layer,
});

// Remove external overlay
export const removeExternalOverlay = (id) => ({
    type: types.EXTERNAL_OVERLAY_REMOVE,
    id,
});

// Fetch external layers from Web API
export const fetchExternalLayers = () => (dispatch) =>
  getD2()
    .then(d2 => d2.models.externalMapLayers.list({
      fields: 'id,displayName~rename(name),service,url,attribution,mapService,layer,imageFormat,mapLayerPosition,legendSet,legendSetUrl',
      paging: false,
    }))
    .then(mapLayers => mapLayers.forEach(layer => {
        const config = externalLayerConfig(layer);

        if (layer.mapLayerPosition === 'BASEMAP') {
            dispatch(addBasemap(config));
        } else { // OVERLAY
            dispatch(addExternalOverlay(config));
        }
    }));

// Create external layer config object
const externalLayerConfig = (layer) => {
    const config = {
        type: 'tileLayer',
        url: layer.url,
        attribution: layer.attribution,
    };

    if (layer.mapService === 'TMS') {
        config.tms = true;
    }

    if (layer.mapService === 'WMS') {
        config.type = 'wmsLayer';
        config.layers = layer.layers;

        if (layer.imageFormat === 'JPG') { // PNG is default
            config.format = 'image/jpeg';
        }
    }

    return {
        id: layer.id,
        type: 'external',
        title: layer.name,
        subtitle: layer.mapLayerPosition === 'BASEMAP' ? 'External basemap' : 'External layer', // TODO: i18n
        // img: layer.img, // TODO: Get from Web API
        opacity: 1,
        config,
    }
};
