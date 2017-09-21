import * as types from '../constants/actionTypes';

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

// Load all external layers
export const loadExternalLayers = () => ({
    type: types.EXTERNAL_LAYERS_LOAD,
});

// Fetch external layers from Web API
/*
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
*/


