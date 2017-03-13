import Layer from './Layer';
import isObject from 'd2-utilizr/lib/isObject';

class FacilityLayer extends Layer {

    createLayer(callback) {
        const props = this.props;
        const map = props.map;

        // Create layer config object
        const config = {
            type: 'markers',
            pane: props.id,
            data: props.data,
            hoverLabel: '{label}',
        };

        // Labels and label style
        if (props.labels) {
            config.label = '{name}';
            config.labelStyle = {
                color: props.labelFontColor,
                fontSize: props.labelFontSize,
                fontStyle: props.labelFontStyle,
                fontWeight: props.labelFontWeight,
                paddingTop: '10px'
            };
        }

        // Remove area layer instance if already exist
        if (this.areaInstance && map.hasLayer(this.areaInstance)) {
            map.removeLayer(this.areaInstance);
        }

        // Create and add area layer
        if (props.areaRadius) {
            this.areaInstance = map.addLayer({
                type: 'circles',
                radius: props.areaRadius,
                highlightStyle: false,
                data: props.data
            });
        }

        // Create and add facility layer based on config object
        this.instance = map.createLayer(config).addTo(map);

        // Handle facility click
        this.instance.on('click', this.onFeatureClick, this);

        // Defined in parent class
        this.onLayerAdd();
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

    // Remove layer istance (both facilities and areas)
    removeLayer() {
        if (this.props.map.hasLayer(this.areaInstance)) {
            this.props.map.removeLayer(this.areaInstance);
        }
        super.removeLayer();
    }

}

export default FacilityLayer;