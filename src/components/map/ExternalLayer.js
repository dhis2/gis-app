import Layer from './Layer';
import isString from 'd2-utilizr/lib/isString';

export default class ExternalLayer extends Layer {
    createLayer() {
        const props = this.props;
        const layer = props.layer;
        const config = layer.config;
        const map = props.map;

        config.type = 'tileLayer'; // TODO: Should be part of config object
        config.pane = layer.id;
        
        this.instance = map.createLayer(config).addTo(map);
    }
}