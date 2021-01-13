"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("test");
var ATP_map = /** @class */ (function () {
    function ATP_map(mapid, center, zoom) {
        this.map = L.map(mapid).setView(center, zoom);
        L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(this.map);
    }
    return ATP_map;
}());
exports.default = ATP_map;
var atp_area_prediction_array = [];
var shapes_color = ['blue', 'red', 'yellow'];
function areaToCoords(area) {
    var newArr = [];
    while (area.length)
        newArr.push(area.splice(0, 2));
    return newArr;
}
var map_area;
updateArea();
var available_area;
if ($("#av-area").text()) {
    available_area = JSON.parse($("#av-area").text());
    L.rectangle(areaToCoords(available_area), { interactive: false, fillOpacity: 0 }).addTo(mymap);
}
