import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d2map from 'gis-api/src/';
import Layer from './Layer';
import EarthEngineLayer from './EarthEngineLayer';

const style = {
    width: '100%',
    height: '100%',
}

const layerTypeToLayerComponent = new global.Map([
    ['earthEngine', EarthEngineLayer],
]);

function getLayerForType(layer) {
    const type = layer && layer.config && layer.config.type;

    if (layerTypeToLayerComponent.has(type))
        return layerTypeToLayerComponent.get(type)
    return Layer;
}

class Map extends Component {

    constructor(props) {
        super(props);

        // Create map div
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';

        this.map = d2map(div);
    }

    // Append map container to DOM on mount
    componentDidMount() {
        const props = this.props;

        const mapEl = ReactDOM.findDOMNode(this.refs.map);

        mapEl.append(this.map.getContainer());

        this.map.setView([props.latitude, props.longitude], props.zoom);
    }

    render() {
        return (
            <div ref="map" style={style}>
                {this.props.layers.map((layer, index) => {
                    const MapLayer = getLayerForType(layer);

                    return (
                        <MapLayer
                            {...layer}
                            key={`layer-${layer.type}`}
                            index={index}
                            map={this.map}
                        />
                    )
                })}
            </div>
        )
    }
}

export default Map;