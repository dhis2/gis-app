import { Component } from 'react';

export default class Layer extends Component {
    constructor(props, context) {
        super(props, context);

        this.createLayer();
        this.setLayerOrder();
        this.setLayerOpacity();
        this.setLayerVisibility();
    }

    componentDidUpdate(prevProps) {
        const props = this.props;

        if (props.config !== prevProps.config) {
            this.removeLayer();
            this.createLayer();
        }

        if (prevProps.order !== props.order) {
            this.setLayerOrder();
        }

        if (prevProps.opacity !== props.opacity) {
            this.setLayerOpacity();
        }

        if (prevProps.visible !== props.visible) {
            this.setLayerVisibility();
        }
    }

    componentWillUnmount() {
        this.removeLayer();
    }

    createLayer() {
        this.instance = this.props.map.addLayer({...this.props.config});
    }

    setLayerOpacity() {
        this.instance.setOpacity(this.props.opacity);
    }

    setLayerOrder() {
        this.mapPane = this.props.map.createPane('layer-' + this.props.index);
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
        if (this.props.map.hasLayer(this.instance)) {
            this.props.map.removeLayer(this.instance);
        }
        delete(this.mapPane);
        delete(this.instance);
    }

    render() {
        return null;
    }
}
