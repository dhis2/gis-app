import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d2map from 'gis-api/src/';
import Layer from './Layer';
import EventLayer from './EventLayer';
import FacilityLayer from './FacilityLayer';
import EarthEngineLayer from './EarthEngineLayer';

const layerTypeToLayerComponent = new global.Map([
    ['event',       EventLayer],
    ['facility',    FacilityLayer],
    ['earthEngine', EarthEngineLayer]
]);

function getLayerForType(layer) {
    // const type = layer && layer.config && layer.config.type;
    const type = layer.layerType;

    if (layerTypeToLayerComponent.has(type))
        return layerTypeToLayerComponent.get(type)
    return Layer;
}

const style = {
    width: '100%',
    height: '100%',
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
        const props = this.props;

        const basemap = {
            ...props.basemaps.filter(basemap => basemap.id === props.basemap.id)[0], // TODO: Handle missing basemap id
            ...props.basemap
        };

        return (
            <div ref="map" style={style}>
                {this.props.overlays.filter(layer => layer.loaded).map((layer, index) => { // Only render loaded layers
                    const MapLayer = getLayerForType(layer);

                    return (
                        <MapLayer
                            {...layer}
                            key={layer.id}
                            map={this.map}
                            index={index}
                        />
                    )
                })}
                <Layer {...basemap} key="basemap" map={this.map} />
            </div>
        )
    }
}

export default Map;