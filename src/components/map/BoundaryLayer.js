import Layer from './Layer';

export default class BoundaryLayer extends Layer {

    createLayer() {
        const props = this.props;
        const map = props.map;

        const config = {
            type: 'boundary',
            pane: props.id,
            data: props.data,
            hoverLabel: '{name}',
            style: {
                opacity: 1,
                fillOpacity: 0,
                fill: false,
            },
        };

        if (props.labels) {
            config.label = '{name}';
            config.labelStyle = {
                fontSize: view.labelFontSize,
                fontStyle: view.labelFontStyle
            };
        }


        if (props.radiusLow) {
            config.style.radius = props.radiusLow;
        }

        this.instance = map.createLayer(config).addTo(map);

        this.instance.on('click', this.onFeatureClick, this);
        this.instance.on('contextmenu', this.onFeatureRightClick, this);
    }

    onFeatureClick(evt) {
        const attr = evt.layer.feature.properties;
        let content = '<div class="leaflet-popup-orgunit"><em>' + attr.name + '</em>';

        if (attr.level) {
            content += '<br/>' + GIS.i18n.level + ': ' + attr.level;
        }

        if (attr.parentName) {
            content += '<br/>' + GIS.i18n.parent_unit + ': ' + attr.parentName;
        }

        content += '</div>';

        L.popup()
            .setLatLng(evt.latlng)
            .setContent(content)
            .openOn(this.props.map);
    }

    onFeatureRightClick(evt) {
        L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
        const contextMenu = GIS.core.ContextMenu(gis, this.props, evt.layer, evt.latlng); // TODO
        contextMenu.showAt([evt.originalEvent.x, evt.originalEvent.pageY || evt.originalEvent.y]);
    }

    removeLayer() {
        this.instance.off('click', this.onFeatureClick, this);
        this.instance.off('contextmenu', this.onFeatureRightClick, this);

        super.removeLayer();
    }

}