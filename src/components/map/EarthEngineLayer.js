import Layer from './Layer';

// TODO: How to share headers for all fetch requests
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

export default class EarthEngineLayer extends Layer {
    createLayer() {
        const config = {
            ...this.props.config,
            pane: this.props.id,
        };

        config.accessToken = (callback) => {
            fetch('//localhost:8080/api/27/tokens/google', { headers })
                .then(response => response.json())
                .then(json => callback(json))
                .catch(error => console.log('parsing failed', error));
        };

        this.instance = this.props.map.createLayer(config).addTo(this.props.map);
    }
}