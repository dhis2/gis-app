import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Layer extends PureComponent {

    static contextTypes = {
        map: PropTypes.object,
    };

    // Create pane and layer
    componentWillMount() {
        console.log('layer componentWillMount');

        const { index } = this.props;

        this.createPane();
        this.createLayer();
    }

    //
    componentDidMount() {
        console.log('layer componentDidMount');

        const map = this.context.map;

        map.addLayer(this.layer);
        this.onLayerAdd();

    }

    componentDidUpdate(prev) {
        console.log('layer componentDidUpdate');

        const { id, index, opacity, visible } = this.props;

        // if (layer.editCounter !== prevLayer.editCounter || layer.config !== prevLayer.config) { // TODO

        if (id !== prev.id) {
            this.removeLayer();
            this.createLayer();
            this.context.map.addLayer(this.layer);
            this.onLayerAdd();
        }

        // if (props.index !== undefined && prevLayer.index !== layer.index) {
        if (index !== undefined) {
            this.setLayerOrder();
        }

        if (opacity !== prev.opacity) {
            this.setLayerOpacity();
        }

        if (visible !== prev.visible) {
            this.setLayerVisibility();
        }
    }

    componentWillUnmount() {
        console.log('layer componentWillUnmount');
        this.removeLayer();
    }

    // Create custom pane to control layer ordering: http://leafletjs.com/examples/map-panes/
    createPane() {
        // console.log('createPane');

        const { id, labels } = this.props;
        const map = this.context.map;

        this.pane = map.createPane(id);

        if (labels) {
            this.labelPane = map.createPane(`${id}-labels`);
        }
    }

    // Create new layer from config object (override in subclasses)
    createLayer() {
        // console.log('createLayer');

        const { id, index, config } = this.props;
        const map = this.context.map;
        const layerConfig = {
            ...config,
        };

        if (index !== undefined) { // If not a basemap
            layerConfig.pane = id;
        }

        this.layer = map.createLayer(layerConfig);
    }

    onLayerAdd() {
        // console.log('onLayerAdd');

        this.setLayerOpacity();
        this.setLayerVisibility();

        if (this.props.index !== undefined) { // Basemap don't have index
            this.setLayerOrder();
        }
    }

    setLayerOpacity() {
        // console.log('setLayerOpacity');

        this.layer.setOpacity(this.props.opacity);
    }

    // Set layer order using custom panes and z-index: http://leafletjs.com/examples/map-panes/
    setLayerOrder() {
        // console.log('setLayerOrder');

        const { index } = this.props;
        const zIndex = 600 - (index * 10);

        if (this.pane) { // TODO: Needed?
            this.pane.style.zIndex = zIndex;
        }

        if (this.labelPane) {
            this.labelPane.style.zIndex = zIndex + 1;
        }
    }

    setLayerVisibility() {
        const {visible } = this.props;
        const map = this.context.map;
        const layer = this.layer;

        if (visible && map.hasLayer(layer) === false) {
            map.addLayer(layer);
        } else if (!visible && map.hasLayer(layer) === true) {
            map.removeLayer(layer);
        }
    }

    removeLayer() {
        const layer = this.layer;
        const map = this.context.map;

        // console.log('removeLayer');

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }

        delete(this.layer);
        delete(this.pane);
        delete(this.labelPane);
    }

    render() {
        return null;
    }
}

Layer.propTypes = {
    //visible: PropTypes.bool,
};

Layer.defaultProps = {
    //visible: true,
};

export default Layer;