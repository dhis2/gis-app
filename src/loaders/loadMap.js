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

const onMapLoad = data => {
    if (data.mapViews) {
        data.overlays = data.mapViews.map(view => {
            view.type = layerTypes[view.layer]; // TODO: use only "type"?
            view.title = view.name;
            view.isLoaded = false;
            return view;
        });
        delete(data.mapViews);
    }

    callback (data);
};

const loadMap = (id, cb) =>  {
    callback = cb;

    const mapFields = gis.conf.url.mapFields.join(','); // TODO

    apiFetch(`maps/${id}.json?fields=${mapFields}`)
        .then(response => response.json())
        .then(onMapLoad)
        .catch(error => gis.alert('Loading failed: ' + error)); // TODO
};

export default loadMap;