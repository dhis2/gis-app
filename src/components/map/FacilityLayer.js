import Layer from './Layer';
import isObject from 'd2-utilizr/lib/isObject';

class FacilityLayer extends Layer {

    createLayer(callback) {
        const props = this.props;
        const layer = props.layer;
        const map = props.map;

        // Create layer config object
        const config = {
            type: 'markers',
            pane: layer.id,
            data: layer.data,
            hoverLabel: '{label}',
        };

        // Labels and label style
        if (layer.labels) {
            config.label = '{name}';
            config.labelStyle = {
                color: layer.labelFontColor,
                fontSize: layer.labelFontSize,
                fontStyle: layer.labelFontStyle,
                fontWeight: layer.labelFontWeight,
                paddingTop: '10px'
            };
        }

        // Remove area layer instance if already exist
        if (this.areaInstance && map.hasLayer(this.areaInstance)) {
            map.removeLayer(this.areaInstance);
        }

        // Create and add area layer
        if (layer.areaRadius) {
            this.areaInstance = map.addLayer({
                type: 'circles',
                radius: layer.areaRadius,
                highlightStyle: false,
                data: layer.data
            });
        }

        // Create and add facility layer based on config object
        this.instance = map.createLayer(config).addTo(map);

        // Handle facility click
        this.instance.on('click', this.onFeatureClick, this);
        this.instance.on('contextmenu', this.onFeatureRightClick, this);

        // Defined in parent class
        // this.onLayerAdd();

        map.fitBounds(this.instance.getBounds()); // TODO: Do as action?
    }

    // Show pupup on facility click
    onFeatureClick(evt) {
        const attr = evt.layer.feature.properties;
        let content = '<div class="leaflet-popup-orgunit"><em>' + attr.name + '</em>';

        if (isObject(attr.dimensions)) {
            content += '<br/>' + GIS.i18n.groups + ': ' + Object.keys(attr.dimensions).map(id => attr.dimensions[id]).join(', ');
        }

        if (attr.pn) {
            content += '<br/>' + GIS.i18n.parent_unit + ': ' + attr.pn;
        }

        content += '</div>';

        L.popup()
            .setLatLng(evt.latlng)
            .setContent(content)
            .openOn(this.props.map);
    };

    onFeatureRightClick(evt) {
        L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click

        const latlng = evt.latlng;
        const position = [evt.originalEvent.x, evt.originalEvent.pageY || evt.originalEvent.y];
        const layer = this.props.layer;

        this.props.openContextMenu({
            position,
            coordinate: [latlng[1], latlng[0]],
            layerId: layer.id,
            layerType: layer.type,
            feature: evt.layer.feature,
        });
    }

    // Remove layer istance (both facilities and areas)
    removeLayer() {
        if (this.props.map.hasLayer(this.areaInstance)) {
            this.props.map.removeLayer(this.areaInstance);
        }
        super.removeLayer();
    }

}

export default FacilityLayer;