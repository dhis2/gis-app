// TODO: Use d2? Make promise based?

import {isValidCoordinate} from '../util/map';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';

// TODO: How to share headers for all fetch requests?
// TODO: Use apiFetch
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

// Load facilites for map display
const facilityLoader = (layer, callback) =>  {
    const groupSetId = layer.organisationUnitGroupSet.id;
    const groupSetUrl = gis.init.apiPath + 'organisationUnitGroupSets/' + groupSetId + '.json' + '?fields=organisationUnitGroups[id,' + gis.init.namePropertyUrl + ',symbol]';

    const items = layer.rows[0].items.map(item => item.id).join(';');
    const propertyMap = {
        name: 'name',
        displayName: 'name',
        shortName: 'shortName',
        displayShortName: 'shortName',
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

// Called when group set and facilities are loaded
const onDataLoad = (groupSet, facilities, layer, callback) => {
    const indicator = layer.organisationUnitGroupSet.id;
    const orgUnitGroupSymbols = {};
    const features = [];

    // Easier lookup of unit group symbols
    groupSet.forEach((group, index) => {
        if (!group.symbol) { // Add default symbol
            group.symbol = (21 + index) + '.png'; // Symbol 21-25 are coloured circles
        }
        orgUnitGroupSymbols[group.id] = group;
    });

    // Convert API response to GeoJSON features
    facilities.forEach(facility => {
        if (facility.ty === 1 && isObject(facility.dimensions)) { // Only add points belonging to an org.unit group
            const coord = JSON.parse(facility.co);
            const id = facility.dimensions[indicator];
            const group = orgUnitGroupSymbols[id];

            if (isValidCoordinate(coord) && group) {
                features.push({
                    type: 'Feature',
                    id: facility.id,
                    properties: {
                        id: facility.id,
                        name: facility.na,
                        label: facility.na + ' (' + group.name + ')',
                        icon: {
                            iconUrl: gis.init.contextPath + '/images/orgunitgroup/' + group.symbol,
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

    layer.data = features;
    layer.title = 'Facilities'; // TODO
    layer.legend = createLegend(groupSet);

    callback(layer);
};

// Create group set legend
const createLegend = (groupSet) => {
    return {
        items: groupSet.map(item => ({
            image: gis.init.contextPath + '/images/orgunitgroup/' + item.symbol, // TODO
            name: item.name,
        }))
    }
};

export default facilityLoader;