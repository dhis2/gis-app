import { Component } from 'react';

class Layer extends Component {
    constructor(props, context) {
        super(props, context);

        this.createLayer();
        this.setLayerVisibility();

    }

    componentDidUpdate(prevProps) {
        const props = this.props;
        // console.log('componentDidUpdate');

        // console.log('opacity', prevProps.opacity, props.opacity);

        if (props.config !== prevProps.config) {
            this.removeLayer();
            this.createLayer();
        }

        if (prevProps.opacity !== props.opacity) {
            this.instance.setOpacity(props.opacity);
        }

        if (prevProps.visible !== props.visible) {
            this.setLayerVisibility();
        }
    }

    createLayer() {
        const config = {...this.props.config};

        this.instance = this.props.map.createLayer(config).addTo(this.props.map);
    }

    setLayerVisibility() {
        const props = this.props;
        const map = props.map;

        if (props.visible && map.hasLayer(this.instance) === false) {
            map.addLayer(this.instance);
        } else if (!props.visible && map.hasLayer(this.instance) === true) {
            map.removeLayer(this.instance);
        }

    }


    removeLayer() {
        //if (this.instance) {
            if (this.props.map.hasLayer(this.instance)) {
                this.props.map.removeLayer(this.instance);
            }
            delete(this.instance);
        //}
    }

    render() {
        // console.log('layer render', this.props.map);

        return null;
    }
}


export default Layer;
