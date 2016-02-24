import d2map from 'dhis2-gis-api/src/';

export default function getMap() {
    return d2map(document.createElement('div'));
};
