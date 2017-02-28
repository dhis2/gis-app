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

    // Create layer pane
    createPane() {
        // this.pane = this.props.map.createPane(this.props.id);
        this.pane = this.props.map.createPane(this.props.id);
    }

    createLayer() {
        // console.log('Create layer');

        const props = this.props;
        const map = props.map;

        this.instance = map.addLayer({
            ...props.config,
            //pane: props.id,
        });


    }

    setLayerOpacity() {
        this.instance.setOpacity(this.props.opacity);
    }

    setLayerOrder() {
        const props = this.props;

        props.map.getPane(props.id).style.zIndex = 300 - (props.index * 10);

        console.log('set layer order', props.title, props.map.getPane(props.id), this.instance.getPane());
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
