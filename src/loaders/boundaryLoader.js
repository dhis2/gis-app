import { apiFetch } from '../util/api';
import { toGeoJson } from '../util/map';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';
import arrayUnique from 'd2-utilizr/lib/arrayUnique';

let layer;
let callback;

const onDataLoad = (data) => {
    const features = toGeoJson(data, 'ASC');
    const colors = ['black', 'blue', 'red', 'green', 'yellow'];
    const weights = [2, 1, 0.75, 0.5, 0.5];
    const levelStyle = {};
    let levels = [];

    if (!data.length) {
        gis.mask.hide();
        gis.alert(GIS.i18n.no_valid_coordinates_found);
        return;
    }

    for (let i = 0; i < data.length; i++) {
        levels.push(parseInt(data[i].le));
    }

    levels = arrayUnique(levels).sort();

    for (let i = 0; i < levels.length; i++) {
        levelStyle[levels[i]] = {
            color: colors[i],
            weight: (levels.length === 1 ? 1 : weights[i])
        };
    }

    // Apply feature styles
    for (let i = 0, feature; i < features.length; i++) {
        feature = features[i];
        feature.properties.style = levelStyle[feature.properties.level];
    }

    features.forEach(feature => {
        feature.properties.labelStyle = {
            paddingTop: feature.geometry.type === 'Point' ? 5 + (layer.radiusLow || 5) + 'px' : '0'
        };
    });

    // Store features for search
    // layer.featureStore.loadFeatures(features.slice(0));
    layer.data = features;

    callback(layer);
};

const boundaryLoader = (config, cb) =>  {
    layer = config;
    callback = cb;

    // TODO: Reuse code from thematicLoader?
    const items = layer.rows[0].items;
    const propertyMap = {
        'name': 'name',
        'displayName': 'name',
        'shortName': 'shortName',
        'displayShortName': 'shortName'
    };

    const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty; // TODO
    // const displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[xLayout.displayProperty] || 'name'; // xLayoutt ?
    const displayProperty = propertyMap[keyAnalysisDisplayProperty] || 'name';

    let params = '?ou=ou:' + items.map(item => item.id).join(';') + '&displayProperty=' + displayProperty.toUpperCase();

    if (isArray(layer.userOrgUnit) && layer.userOrgUnit.length) {
        params += '&userOrgUnit=' + layer.userOrgUnit.map(unit => unit).join(';');
    }

    if (isArray(layer.userOrgUnit) && layer.userOrgUnit.length) {
        params += '&userOrgUnit=' + layer.userOrgUnit.map(unit => unit).join(';');
    }

    // gis.init.apiPath + 'geoFeatures.json' + params;

    apiFetch(`geoFeatures.json${params}`)
        .then(response => response.json())
        .then(data => onDataLoad(data, layer, callback))
        .catch(error => console.log('Parsing failed: ', error)); // TODO

};

export default boundaryLoader;