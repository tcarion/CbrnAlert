import { Layer, LeafletEvent, LeafletEventHandlerFn, LeafletMouseEvent } from "leaflet";

let L = require('leaflet')
let leafletDraw = require('leaflet-draw')
let HeatmapOverlay = require('leaflet-heatmap')
export default class ATP_map implements ATP_map {
    map: any;
    drawn_shapes: ShapeData[];
    marker: any;
    area_rect: any;
    heatmapLayer: any;

    constructor(mapid: string, center: Array<string | number>, zoom: number | string, public clickable: boolean = false, public drawnable: boolean = false) {

        this.map = L.map(mapid).setView(center, zoom);
        this.drawn_shapes = [];
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 1,
            maxZoom: 20
        }).addTo(this.map);
        L.control.scale().addTo(this.map);
        this.marker = null;
        this.area_rect = null;
        
        let cfg = {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            // if scaleRadius is false it will be the constant radius used in pixels
            "radius": 50,
            "maxOpacity": .8,
            // scales the radius based on map zoom
            "scaleRadius": false,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'val'
        };

        this.heatmapLayer = new HeatmapOverlay(cfg);

        this.heatmapLayer.addTo(this.map)

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

    drawHeatmap(lons: string[], lats: string[], values: string[]) {
        let to_plot = {
            data: [] as any
          };
        values.map((e:string, i:number) => {
            to_plot.data.push({
                lng: parseFloat(lons[i]),
                lat: parseFloat(lats[i]),
                val: parseFloat(e)
            })
        })
        this.heatmapLayer.setData(to_plot);
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




