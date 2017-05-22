import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Layer extends PureComponent {

    static contextTypes = {
        map: PropTypes.object,
    };

    constructor(props, context) {
        super(props, context);

        this.createPane();
        this.createLayer();
        if (props.index !== undefined) {
            this.setLayerOrder();
        }



    }

    componentWillMount() {
        console.log('layer componentWillMount');
    }

    componentDidMount() {
        console.log('layer componentDidMount');
    }

    componentDidUpdate(prev) {
        console.log('layer componentDidUpdate');

        const { id, index, opacity, visible } = this.props;

        // if (layer.editCounter !== prevLayer.editCounter || layer.config !== prevLayer.config) { // TODO


        console.log('########', this.props);


        if (id !== prev.id) {
            this.removeLayer();
            this.createLayer();
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
        console.log('createPane');

        const { id, labels } = this.props;
        const map = this.context.map;

        this.pane = map.createPane(id);

        if (labels) {
            this.labelPane = map.createPane(`${id}-labels`);
        }
    }

    // Create new layer from config object (override in subclasses)
    createLayer() {
        console.log('createLayer');

        const { id, index, config } = this.props;
        const map = this.context.map;
        const layerConfig = {
            ...config,
        };

        if (index !== undefined) { // If not a basemap
            config.pane = id;
        }

        this.layer = map.addLayer(layerConfig);
        this.onLayerAdd();
    }

    onLayerAdd() {
        console.log('onLayerAdd');

        this.setLayerOpacity();
        this.setLayerVisibility();

        if (this.props.index !== undefined) { // Basemap don't have index
            this.setLayerOrder();
        }
    }

    setLayerOpacity() {
        console.log('setLayerOpacity');

        this.layer.setOpacity(this.props.opacity);
    }

    // Set layer order using custom pages and z-index: http://leafletjs.com/examples/map-panes/
    setLayerOrder() {
        console.log('setLayerOrder');
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

        console.log('removeLayer');

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