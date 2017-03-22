import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d2map from 'gis-api/src/';
import Layer from './Layer';
import EventLayer from './EventLayer';
import FacilityLayer from './FacilityLayer';
import ThematicLayer from './ThematicLayer';
import BoundaryLayer from './BoundaryLayer';
import EarthEngineLayer from './EarthEngineLayer';
import ExternalLayer from './ExternalLayer';

const layerTypeToLayerComponent = new global.Map([
    ['event',       EventLayer],
    ['facility',    FacilityLayer],
    ['thematic',    ThematicLayer],
    ['boundary',    BoundaryLayer],
    ['earthEngine', EarthEngineLayer],
    ['external',    ExternalLayer]
]);

function getLayerForType(layer) {
    if (layerTypeToLayerComponent.has(layer.type))
        return layerTypeToLayerComponent.get(layer.type)
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

        if (props.bounds) {
            this.map.fitBounds(props.bounds);
        } else if (props.latitude && props.longitude && props.zoom) {
            this.map.setView([props.latitude, props.longitude], props.zoom);
        }
    }

    componentDidUpdate(prevProps) {
        // console.log('map did update');
    }

    render() {
        const props = this.props;
        const basemap = {
            ...props.basemaps.filter(b => b.id === props.basemap.id)[0],
            ...props.basemap
        };

        return (
            <div ref="map" style={style}>
                {props.overlays.filter(layer => layer.isLoaded).map((layer, index) => {
                    const MapLayer = getLayerForType(layer);

                    return (
                        <MapLayer
                            key={layer.id}
                            map={this.map}
                            index={index}
                            layer={layer}
                        />
                    )
                })}
                <Layer layer={basemap} key="basemap" map={this.map} />
            </div>
        )
    }
}

export default Map;

