let L = require('leaflet')

export default class ATP_map implements ATP_map {
    map: any;
    drawn_shapes: ShapeData[];
    marker: any;

    constructor(mapid: string, center: Array<string | number>, zoom: number | string, public clickable: boolean) {
        this.map = L.map(mapid).setView(center, zoom);
        this.drawn_shapes = [];
        L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(this.map);
        L.control.scale().addTo(this.map);
        this.marker = null;
    }

    areaToCoords(area: number[]) {
        let newArr = [];
        while (area.length) newArr.push(area.splice(0, 2));
        return newArr;
    }

    get map_area() {
        let bounds = this.map.getBounds();
        return [
            Math.ceil(bounds.getNorthWest().lat),
            Math.floor(bounds.getNorthWest().lng),
            Math.floor(bounds.getSouthEast().lat),
            Math.ceil(bounds.getSouthEast().lng)
        ];
    };

    drawShapes(shape_data: ShapeData, map: any) {
        shape_data.shapes.forEach((shape: Shape, i: number) => {
            let shapes_color = ['blue', 'red', 'yellow']
            L.polygon(shape.coords, {color : shapes_color[i]}).addTo(map).bindPopup(shape.text);
        });
        this.drawn_shapes.push(shape_data);
    }

    newMarker(lon: number, lat: number) {
        if (this.marker !== null) {
            this.map.removeLayer(this.marker)
        }
        this.marker = L.marker([lat, lon]);
        this.marker.addTo(this.map);
    }
}




