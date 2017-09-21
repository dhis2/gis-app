// import { apiFetch } from '../util/api';
import { toGeoJson } from '../util/map';
import isArray from 'd2-utilizr/lib/isArray';
import arrayUnique from 'd2-utilizr/lib/arrayUnique';
import { getInstance as getD2 } from 'd2/lib/d2';

let layer;
let callback;

const onDataLoad = (data) => {
    const features = toGeoJson(data, 'ASC');
    const colors = ['black', 'blue', 'red', 'green', 'yellow'];
    const weights = [2, 1, 0.75, 0.5, 0.5];
    const levelStyle = {};
    let levels = [];

    if (!data.length) {
        // gis.mask.hide();
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

    layer.data = features;
    layer.title = 'Boundaries'; // TODO

    callback(layer);
};

const boundaryLoader = (config, cb) =>  {
    layer = config;
    callback = cb;

    // TODO: Reuse code from thematicLoader?
    const orgUnits = layer.rows[0].items.map(item => item.id);

    const propertyMap = {
        'name': 'name',
        'displayName': 'name',
        'shortName': 'shortName',
        'displayShortName': 'shortName'
    };

    const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty; // TODO
    const displayProperty = (propertyMap[keyAnalysisDisplayProperty] || 'name').toUpperCase();

    let params = '?ou=ou:' + orgUnits.join(';') + '&displayProperty=' + displayProperty;

    getD2()
        .then((d2) => d2.geoFeatures
            .byOrgUnit(orgUnits)
            .displayProperty(displayProperty)
            .getAll()
        )
        .then((data) => onDataLoad(data, layer, callback));

};

export default boundaryLoader;