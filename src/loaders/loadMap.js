import { apiFetch } from '../util/api';

let callback;

const onMapLoad = data => {
    if (data.mapViews) {
        data.overlays = data.mapViews.map(view => {
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