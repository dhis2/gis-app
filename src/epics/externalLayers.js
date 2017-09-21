import { combineEpics } from 'redux-observable';
import { getInstance as getD2 } from 'd2/lib/d2';
import 'rxjs/add/operator/concatMap';
import * as types from '../constants/actionTypes';
import { addBasemap } from '../actions/basemap';
import { addExternalOverlay } from '../actions/externalLayers';
import { errorActionCreator } from '../actions/helpers';

// Loade external layers from Web API
export const loadExternalLayers = (action$) =>
    action$
        .ofType(types.EXTERNAL_LAYERS_LOAD)
        .concatMap(() =>
            getD2()
                .then(d2 => d2.models.externalMapLayers.list({
                    fields: 'id,displayName~rename(name),service,url,attribution,mapService,layer,imageFormat,mapLayerPosition,legendSet,legendSetUrl',
                    paging: false,
                }))
                .then((mapLayers => mapLayers.forEach(layer => {
                    const config = externalLayerConfig(layer);

                    console.log('config', config);

                    if (layer.mapLayerPosition === 'BASEMAP') {
                        return addBasemap(config);
                    } else { // OVERLAY
                        return addExternalOverlay(config);
                    }
                })))
                .catch(errorActionCreator(types.EXTERNAL_LAYERS_LOAD_ERROR))
        );

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

export default combineEpics(loadExternalLayers);