// Replacing GIS.core.getOLMap

GIS.core.getMapApi = function(gis) {
    //console.log("getMap", gis);

    //var map = L.map();

    //.setView([51.505, -0.09], 13);

    /*
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    */

    return L;
};