import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layer from './Layer';
import EventLayer from './EventLayer';
import FacilityLayer from './FacilityLayer';
import ThematicLayer from './ThematicLayer';
import BoundaryLayer from './BoundaryLayer';
import EarthEngineLayer from './EarthEngineLayer';
import ExternalLayer from './ExternalLayer';
import { isArray, isNumeric } from 'd2-utilizr';
import { HEADER_SIZE, LAYERS_PANEL_SIZE, DATA_TABLE_SIZE } from '../../constants/layout';

const layerType = {
    event:       EventLayer,
    facility:    FacilityLayer,
    thematic:    ThematicLayer,
    boundary:    BoundaryLayer,
    earthEngine: EarthEngineLayer,
    external:    ExternalLayer
};

class Map extends Component {

    static contextTypes = {
        map: PropTypes.object,
    };

    componentWillMount() {
        this.context.map.on('contextmenu', this.onRightClick, this);
    }

    componentDidMount() {
        const { bounds, latitude, longitude, zoom } = this.props;
        const map = this.context.map;

        this.node.appendChild(map.getContainer()); // Append map container to DOM

        if (isArray(bounds)) {
            map.fitBounds(bounds);
        } else if (isNumeric(latitude) && isNumeric(longitude) && isNumeric(zoom)) {
            map.setView([latitude, longitude], zoom);
        }
    }

    componentDidUpdate(prevProps) {
        const { coordinatePopup } = this.props;

        if (coordinatePopup) {
            this.showCoordinate(coordinatePopup);
        }

        this.context.map.invalidateSize();
    }

    // Remove map
    componentWillUnmount() {
        this.context.map.remove();
    }

    showCoordinate(coord) {
        L.popup()
            .setLatLng([coord[1], coord[0]])
            .setContent('Longitude: ' + coord[0].toFixed(6) + '<br />Latitude: ' + coord[1].toFixed(6))
            .on('remove', this.props.closeCoordinatePopup)
            .openOn(this.context.map);
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
        const {
            basemap,
            basemaps,
            overlays,
            layersPanelOpen,
            dataTableOpen,
            openContextMenu
        } = this.props;

        const basemapConfig = {
            ...basemaps.filter(b => b.id === basemap.id)[0],
            ...basemap
        };

        const style = {
            position: 'absolute',
            top: HEADER_SIZE,
            left: layersPanelOpen ? LAYERS_PANEL_SIZE : 0,
            bottom: dataTableOpen ? DATA_TABLE_SIZE : 0,
            right: 0,
        };

        return (
            <div ref={node => this.node = node} style={style}>
                {overlays.filter(layer => layer.isLoaded).map((layer, index) => {
                    const Overlay = layerType[layer.type] || Layer;

                    return (
                        <Overlay
                            key={layer.id}
                            index={index}
                            {...layer}
                            openContextMenu={openContextMenu}
                        />
                    )
                })}
                <Layer key='basemap' {...basemapConfig} />
            </div>
        )
    }
}

export default Map;
