import Layer from './Layer';
import { apiFetch } from '../../util/api';

export default class EarthEngineLayer extends Layer {
    createLayer() {
        const props = this.props;
        const layer = props.layer;
        const map = props.map;

        /* TODO
         if (typeof view.config === 'string') { // From database as favorite
         view.config = JSON.parse(view.config);
         }
         */

        const config = {
            type: 'earthEngine',
            pane: layer.id,
            id: layer.datasetId,
            band: layer.band,
            mask: layer.mask,
            attribution: layer.attribution,
            filter: layer.filter,
        };

        if (layer.params) {
            config.params = layer.params;
        }

        config.accessToken = (callback) => {
            apiFetch('tokens/google')
                .then(response => response.json())
                .then(json => callback(json))
                .catch(error => console.log('parsing failed', error));
        };

        this.instance = map.createLayer(config).addTo(map);
    }
}