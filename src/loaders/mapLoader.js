import isString from 'd2-utilizr/lib/isString';
import { apiFetch } from '../util/api';

let callback;

const layerTypes = {
    event: 'event',
    facility: 'facility',
    thematic1: 'thematic',
    thematic2: 'thematic',
    thematic3: 'thematic',
    thematic4: 'thematic',
    boundary: 'boundary',
    external: 'external',
    earthEngine: 'earthEngine',
};

const basemap = { // TODO
    id: 'osmLight',
    visible: true,
    expanded: false,
    opacity: 1,
    subtitle: 'Basemap',
};


const onMapLoad = data => {
    if (isString(data.basemap)) {
        data.basemap = {
            id: data.basemap,
        };
    }

    if (data.mapViews) {
        data.overlays = data.mapViews.map(view => {
            view.type = layerTypes[view.layer];
            view.title = view.name;
            view.isLoaded = false;
            return view;
        });
        delete(data.mapViews);
    }

    console.log('onMapLoad', data);
    callback (data);
};

const mapLoader = (id, cb) =>  {
    callback = cb;

    const mapFields = gis.conf.url.mapFields.join(','); // TODO

    apiFetch(`maps/${id}.json?fields=${mapFields}`)
        .then(response => response.json())
        .then(onMapLoad)
        .catch(error => gis.alert('Loading failed: ' + error)); // TODO
};

export default mapLoader;