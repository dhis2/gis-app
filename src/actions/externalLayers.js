import isArray from 'd2-utilizr/lib/isArray';
import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';
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
export const fetchExternalLayers = () => (dispatch) => {
    dispatch(loading());

    return apiFetch('externalMapLayers.json?fields=id,displayName~rename(name),service,url,attribution,mapService,layer,imageFormat,mapLayerPosition,legendSet,legendSetUrl&paging=false')
        .then(res => res.json())
        .then(data => {
            if (data && isArray(data.externalMapLayers)) {
                data.externalMapLayers.forEach(layer => {
                    const config = externalLayerConfig(layer);
                    if (layer.mapLayerPosition === 'BASEMAP') {
                        dispatch(addBasemap(config));
                    } else { // OVERLAY
                        dispatch(addExternalOverlay(config));
                    }
                });
            }
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};

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
        config,
    }
};
