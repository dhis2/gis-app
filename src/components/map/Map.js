import React, { Component, PropTypes } from 'react';
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
};

class Map extends Component {

    constructor(props, context) {
        super(props);

        this.map = context.map;
        this.map.on('contextmenu', this.onRightClick, this);
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
        const props = this.props;

        console.log('componentDidUpdate', props);

        if (props.coordinatePopup) {
            this.showCoordinate(props.coordinatePopup);
        }
    }

    showCoordinate(coord) {
        L.popup()
            .setLatLng([coord[1], coord[0]])
            .setContent('Longitude: ' + coord[0].toFixed(6) + '<br />Latitude: ' + coord[1].toFixed(6))
            .on('remove', this.props.closeCoordinatePopup)
            .openOn(this.map);
    }

    onRightClick(evt) {
        L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click

        const latlng = evt.latlng;
        const position = [evt.originalEvent.x, evt.originalEvent.pageY || evt.originalEvent.y];

        this.props.openContextMenu({
            position,
            coordinate: [latlng.lng, latlng.lat],
        });
    }

    render() {
        const props = this.props;
        const basemap = {
            ...props.basemaps.filter(b => b.id === props.basemap.id)[0],
            ...props.basemap
        };

        console.log('overlays', props.overlays);

        return (
            <div ref="map" style={style}>
                {props.overlays.filter(layer => layer.isLoaded).map((layer, index) => {
                    const Overlay = getLayerForType(layer);

                    console.log('layer id', layer.id);

                    return (
                        <Overlay
                            key={layer.id}
                            map={this.map}
                            index={index}
                            layer={layer}
                            openContextMenu={props.openContextMenu}
                        />
                    )
                })}
                <Layer layer={basemap} key="basemap" map={this.map} />
            </div>
        )
    }
}

Map.contextTypes = {
    map: PropTypes.object
};

export default Map;

