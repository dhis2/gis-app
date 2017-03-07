import Layer from './Layer';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';

// TODO: How to share headers for all fetch requests
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

export default class FacilityLayer extends Layer {

    // TODO: Remove gis dependency
    createLayer(callback) {
        const props = this.props;

        const groupSetId = props.organisationUnitGroupSet.id;
        const groupSetUrl = gis.init.apiPath + 'organisationUnitGroupSets/' + groupSetId + '.json' + '?fields=organisationUnitGroups[id,' + gis.init.namePropertyUrl + ',symbol]';

        const items = props.rows[0].items.map(item => item.id).join(';');
        const propertyMap = {
            'name': 'name',
            'displayName': 'name',
            'shortName': 'shortName',
            'displayShortName': 'shortName'
        };
        const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty;
        //const displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[xLayout.displayProperty] || 'name'; // TODO: xLayout?
        const displayProperty = (propertyMap[keyAnalysisDisplayProperty] || 'name').toUpperCase();
        let params = `?ou=ou:${items}&displayProperty=${displayProperty}`;

        if (isArray(params.userOrgUnit) && params.userOrgUnit.length) {
            const userOrgUnit = view.userOrgUnit.map(unit => unit).join(';');
            params += `&userOrgUnit=${userOrgUnit}`;
        }

        const facilitiesUrl = `${gis.init.apiPath}geoFeatures.json${params}&includeGroupSets=true`;

        const groupSetReq = fetch(encodeURI(groupSetUrl), {headers});
        const facilitiesReq = fetch(encodeURI(facilitiesUrl), {headers});

        // Load data from API
        Promise.all([groupSetReq, facilitiesReq])
            .then(response => Promise.all(response.map(r => r.json())))
            .then(data => this.onDataLoad(data[0].organisationUnitGroups, data[1]))
            .catch(error => console.log('Parsing failed: ', error));
    }

    onDataLoad(groupSet, facilities) {
        const props = this.props;
        const map = props.map;
        const indicator = props.organisationUnitGroupSet.id;
        const orgUnitGroupSymbols = {};
        const features = [];

        // Easier lookup of unit group symbols
        groupSet.forEach((group, index) => {
            if (!group.symbol) { // Add default symbol
                group.symbol = (21 + index) + '.png'; // Symbol 21-25 are coloured circles
            }
            orgUnitGroupSymbols[group.name] = group.symbol;
        });

        // Convert API response to GeoJSON features
        facilities.forEach(facility => {
            if (facility.ty === 1) { // Only add point facilities
                const coord = JSON.parse(facility.co);
                const group = facility.dimensions[indicator];

                if (gis.util.map.isValidCoordinate(coord) && group) { // TODO
                    features.push({
                        type: 'Feature',
                        id: facility.id,
                        properties: {
                            name: facility.na,
                            label: facility.na + ' (' + group + ')',
                            icon: {
                                iconUrl: gis.init.contextPath + '/images/orgunitgroup/' + orgUnitGroupSymbols[group],
                                iconSize: [16, 16]
                            },
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: coord
                        }
                    });
                }
            }
        });

        if (!features.length) {
            // gis.alert(GIS.i18n.no_valid_coordinates_found); // TODO
            return;
        }

        // TODO: Store features for data table

        const config = {
            type: 'markers',
            pane: props.id,
            data: features,
            hoverLabel: '{label}',
        };

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

        if (props.areaRadius) {
            this.areaInstance = map.addLayer({
                type: 'circles',
                radius: props.areaRadius,
                highlightStyle: false,
                data: features
            });
        }

        console.log('props', props);

        this.instance = map.createLayer(config).addTo(map);

        this.instance.on('click', this.onFeatureClick, this);

        this.onLayerAdd();
    }

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

}
