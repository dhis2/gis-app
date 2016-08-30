import d2map from 'dhis2-gis-api/src/';

export default function getMap() {
    const map = d2map(document.createElement('div'));

    // Create map panes to preserve layer ordering
    // This is a temporarily solution until we implement custom layer ordering
    map.createPane('event');
    map.getPane('event').style.zIndex = 630;

    map.createPane('facility');
    map.getPane('facility').style.zIndex = 620;

    map.createPane('boundary');
    map.getPane('boundary').style.zIndex = 460;

    map.createPane('thematic1');
    map.getPane('thematic1').style.zIndex = 450;

    map.createPane('thematic2');
    map.getPane('thematic1').style.zIndex = 440;

    map.createPane('thematic3');
    map.getPane('thematic1').style.zIndex = 430;

    map.createPane('thematic4');
    map.getPane('thematic1').style.zIndex = 420;

    map.createPane('earthEngine');
    map.getPane('earthEngine').style.zIndex = 300;

    map.createPane('external_overlay');
    map.getPane('external_overlay').style.zIndex = 470; // Above thematic and boundary panes
    map.getPane('external_overlay').style.pointerEvents = 'none'; // Don't capture clicks and touches

    map.createPane('external_basemap');
    map.getPane('external_basemap').style.zIndex = 250; // Above other DHIS2 baselayer

    return map;
};
