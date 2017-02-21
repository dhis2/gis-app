import { Component } from 'react';

class Layer extends Component {

    componentDidUpdate(prevProps) {
        this.renderLayer();
    }

    renderLayer() {
        const map = this.props.map;
        const config = this.props.config;

        if (map && config) {

            if (this.instance) {
                map.removeLayer(this.instance);
            }

            this.instance = map.addLayer({...config});
        }
    }

    render() {
        if (!this.instance) {
            this.renderLayer();
        }

        return null;
    }

}


export default Layer;
