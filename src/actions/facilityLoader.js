// TODO: Move to another folder

import {isValidCoordinate} from '../util/map';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';

let map;
let config;

// TODO: How to share headers for all fetch requests
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

const onDataLoad = (groupSet, facilities, layer, callback) => {
    const indicator = layer.organisationUnitGroupSet.id;
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

            if (isValidCoordinate(coord) && group) {
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
        pane: layer.id,
        data: features,
        hoverLabel: '{label}',
    };

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

    layer.config = config;

    callback(layer);
};

const onFeatureClick = (evt) => {
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

const facilityLoader = (layer, callback) =>  {
    const groupSetId = layer.organisationUnitGroupSet.id;
    const groupSetUrl = gis.init.apiPath + 'organisationUnitGroupSets/' + groupSetId + '.json' + '?fields=organisationUnitGroups[id,' + gis.init.namePropertyUrl + ',symbol]';

    const items = layer.rows[0].items.map(item => item.id).join(';');
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
        .then(data => onDataLoad(data[0].organisationUnitGroups, data[1], layer, callback))
        .catch(error => console.log('Parsing failed: ', error));

};

export default facilityLoader;