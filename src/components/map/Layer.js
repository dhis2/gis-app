import { Component } from 'react';

class Layer extends Component {

    componentDidUpdate(prevProps) {
        const props = this.props;
        const map = props.map;

        if (map) {
            this.map = map;

            if (props.id !== prevProps.id) {
                this.removeLayer();
            }

            if (!this.instance) {
                this.instance = map.createLayer({...props.config});
            }

            if (props.visible && map.hasLayer(this.instance) === false) {
                map.addLayer(this.instance);
            } else if (!props.visible && map.hasLayer(this.instance) === true) {
                map.removeLayer(this.instance);
            }

            this.instance.setOpacity(props.opacity);
        }
    }

    removeLayer() {
        if (this.instance) {
            if (this.map.hasLayer(this.instance)) {
                this.map.removeLayer(this.instance);
            }
            delete(this.instance);
        }
    }

    render() {
        return null;
    }
}


export default Layer;
