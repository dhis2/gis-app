import { Component } from 'react';

export default class Layer extends Component {
    constructor(props, context) {
        super(props, context);

        this.createPane();
        this.createLayer();
        this.setLayerOpacity();
        this.setLayerVisibility();

        if (props.index !== undefined) { // Basemap don't have index
            this.setLayerOrder();
        }
    }

    componentDidUpdate(prevProps) {
        const props = this.props;

        if (props.config !== prevProps.config) {
            this.removeLayer();
            this.createLayer();
        }

        if (props.index !== undefined && prevProps.index !== props.index) {
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

    // Create custom pane to control layer ordering: http://leafletjs.com/examples/map-panes/
    createPane() {
        this.pane = this.props.map.createPane(this.props.id);
    }

    // Create new layer from config object (override in subclasses)
    createLayer() {
        const props = this.props;
        const map = props.map;
        const config = {
            ...props.config,
        };

        if (props.index !== undefined) { // If not a basemap
            config.pane = props.id;
        }

        this.instance = map.addLayer(config);
    }

    setLayerOpacity() {
        this.instance.setOpacity(this.props.opacity);
    }

    // Set layer order using custom pages and z-index: http://leafletjs.com/examples/map-panes/
    setLayerOrder() {
        const props = this.props;

        props.map.getPane(props.id).style.zIndex = 600 - (props.index * 10);
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
