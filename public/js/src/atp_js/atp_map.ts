import { Layer, LeafletEvent, LeafletEventHandlerFn, LeafletMouseEvent } from "leaflet";

let L = require('leaflet')
let leafletDraw = require('leaflet-draw')
export default class ATP_map implements ATP_map {
    map: any;
    drawn_shapes: ShapeData[];
    marker: any;
    area_rect: any;

    constructor(mapid: string, center: Array<string | number>, zoom: number | string, public clickable: boolean = false, public drawnable: boolean = false) {

        this.map = L.map(mapid).setView(center, zoom);
        this.drawn_shapes = [];
        L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(this.map);
        L.control.scale().addTo(this.map);
        this.marker = null;
        this.area_rect = null;

        if (drawnable) {
            L.drawLocal.draw.toolbar.buttons.rectangle = 'Area selection for data retrieval';
            L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Please select the area for data retrieval';
            var drawnItems = new L.FeatureGroup();
            this.map.addLayer(drawnItems);
            var drawControl = new L.Control.Draw({
                draw: {
                    polyline: false,
                    polygon: false,
                    circle: false,
                    rectangle: true,
                    marker: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            this.map.addControl(drawControl);
            this.map.on('draw:created', (e: any) => {
                this.newRectangle(e.layer)
            });
        }

        this._initMousePos()
        L.control.mousePosition().addTo(this.map);
    }

    areaToCoords(area: number[]) {
        let newArr = [];
        while (area.length) newArr.push(area.splice(0, 2));
        return newArr;
    }

    get map_area() {
        return this.layerBounds(this.map);
    };

    get rect_area() {
        return this.layerBounds(this.area_rect)
    }

    layerBounds(rect: any) {
        let bounds = rect.getBounds();
        return [
            Math.ceil(bounds.getNorthWest().lat),
            Math.floor(bounds.getNorthWest().lng),
            Math.floor(bounds.getSouthEast().lat),
            Math.ceil(bounds.getSouthEast().lng)
        ];
    }

    drawShapes(shape_data: ShapeData, map: any) {
        shape_data.shapes.forEach((shape: Shape, i: number) => {
            let shapes_color = ['blue', 'red', 'yellow']
            L.polygon(shape.coords, { color: shapes_color[i] }).addTo(map).bindPopup(shape.text);
        });
        this.drawn_shapes.push(shape_data);
    }

    newMarker(lon: string | number, lat: string | number) {
        if (this.marker !== null) {
            this.map.removeLayer(this.marker)
        }
        lon = typeof lon === 'string' ? parseFloat(lon) : lon;
        lat = typeof lat === 'string' ? parseFloat(lat) : lat;
        this.marker = L.marker([lat, lon]);
        this.marker.addTo(this.map);
    }

    newRectangle(rect: Layer) {
        if (this.area_rect !== null) {
            this.map.removeLayer(this.area_rect)
        }
        this.area_rect = rect;
        this.area_rect.addTo(this.map)
    }

    _initMousePos() {
        L.Control.MousePosition = L.Control.extend({
            options: {
                position: 'bottomleft',
                separator: ' : ',
                emptyString: 'Unavailable',
                lngFirst: false,
                numDigits: 5,
                lngFormatter: undefined,
                latFormatter: undefined,
                prefix: ""
            },

            onAdd: function (map: any) {
                this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
                L.DomEvent.disableClickPropagation(this._container);
                map.on('mousemove', this._onMouseMove, this);
                this._container.innerHTML = this.options.emptyString;
                return this._container;
            },

            onRemove: function (map: any) {
                map.off('mousemove', this._onMouseMove)
            },

            _onMouseMove: function (e: any) {
                var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
                var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
                var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
                var prefixAndValue = this.options.prefix + ' ' + value;
                this._container.innerHTML = prefixAndValue;
            }

        });

        L.Map.mergeOptions({
            positionControl: false
        });

        L.Map.addInitHook(function (this: any) {
            if (this.options.positionControl) {
                this.positionControl = new L.Control.MousePosition();
                this.addControl(this.positionControl);
            }
        });

        L.control.mousePosition = function (options: any) {
            return new L.Control.MousePosition(options);
        };
    }
}




