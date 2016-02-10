import d2map from 'dhis2-gis-api';

//GIS.core.getMap = function(gis) {
export default function getMap(gis) {
    var map = d2map(document.createElement('div'), {
        bounds: [[-34.9, -18.7], [35.9, 50.2]]
    });

    return map;
};
