import isArray from 'd2-utilizr/lib/isArray';
import { apiFetch } from '../util/api';
import { loading, loaded } from './loading';
import { addBasemap } from './basemap';
import { addOverlay } from './overlays';

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
                        // dispatch(addOverlay(config));
                    }
                });
            }
            dispatch(loaded());
        }).catch(error => {
            console.log('Error: ', error); // TODO
        });
};


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
        type: layer.mapLayerPosition === 'BASEMAP' ? 'External basemap' : 'External layer', // TODO: i18n
        title: layer.name,
        subtitle: 'Basemap', // TODO: i18n
        // img: layer.img, // TODO: Get from Web API
        config,
    }
};