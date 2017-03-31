import Layer from './Layer';

class ThematicLayer extends Layer {

    createLayer(callback) {
        const props = this.props;
        const layer = props.layer;
        const map = props.map;

        const config = {
            type: 'choropleth',
            pane: layer.id,
            data: layer.data,
            // hoverLabel: '{name} ({value})'
        };

        if (layer.labels) {
            config.label = '{name}';
            config.labelStyle = {
                fontSize: layer.labelFontSize,
                fontStyle: layer.labelFontStyle
            };
        }

        this.instance = map.createLayer(config).addTo(map);

        this.instance.on('click', this.onFeatureClick, this);
        this.instance.on('contextmenu', this.onFeatureRightClick, this);

        map.fitBounds(this.instance.getBounds()); // TODO: Do as action?
    }

    onFeatureClick(evt) {
        const props = this.props;
        const layer = props.layer;
        const indicator = layer.columns[0].items[0].name;
        const period = layer.filters[0].items[0].name;
        const name = evt.layer.feature.properties.name;
        const value = evt.layer.feature.properties.value;
        const aggregationType = evt.layer.feature.properties.aggregationType;
        const content = '<div class="leaflet-popup-orgunit"><em>' + name + '</em><br>' + indicator + '<br>' + period + ': ' + value + ' ' + (aggregationType ? '(' + aggregationType + ')' : '') + '</div>';

        L.popup()
            .setLatLng(evt.latlng)
            .setContent(content)
            .openOn(props.map);
    }

    onFeatureRightClick(evt) {
        L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click

        const pos = [evt.originalEvent.x, evt.originalEvent.pageY || evt.originalEvent.y];

        this.props.openContextMenu(pos, {});

        // console.log(pos, evt, this.props.openContextMenu);

        // const contextMenu = GIS.core.ContextMenu(gis, this.props, evt.layer, evt.latlng); // TODO
        // contextMenu.showAt([evt.originalEvent.x, evt.originalEvent.pageY || evt.originalEvent.y]);
    }

    removeLayer() {
        this.instance.off('click', this.onFeatureClick, this);
        this.instance.off('contextmenu', this.onFeatureRightClick, this);

        super.removeLayer();
    }

}

export default ThematicLayer;