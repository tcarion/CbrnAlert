import { Shape, ShapeData } from './../interfaces/atp45/shape-data';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.heat';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

interface LonLat {
    lon: number,
    lat: number
}
export class CbrnMap {
    public map: L.Map;
    private markerLocation?: LonLat;
    private markerLayer?: L.Marker;
    private atp45Results: ShapeData[] = [];
    public availableArea: L.Layer;
    public areaSelection: L.Rectangle;
    private drawRectangleControl?: L.Control;

    private heatLayer: L.Layer;

    private geojsonLayer: L.GeoJSON<any>;

    private info: any;

    constructor() {

    }

    mapInit(mapid: string, center: L.LatLngExpression, zoom: number) {
        this.map = L.map(mapid).setView(center, zoom);
        this.addTileLayer();
    }

    addTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 1,
            maxZoom: 20
        }).addTo(this.map);
    }

    get marker() {
        return this.markerLocation === undefined ? undefined : this.markerLocation;
    }

    set marker(lonlat: LonLat | undefined) {
        this.markerLocation = lonlat;
        if (lonlat === undefined) {
            this.markerLayer !== undefined && this.map.removeLayer(this.markerLayer)
        }
        else {
            if (this.markerLayer !== undefined) {
                this.map.removeLayer(this.markerLayer)
            }
            this.markerLayer = L.marker([lonlat.lat, lonlat.lon]);
            this.markerLayer.addTo(this.map)
        }
    }

    drawShapes(shape_data: ShapeData) {
        const shapes_color = ['blue', 'red', 'yellow']
        shape_data.shapes.forEach((shape: any, i: number) => {
            L.polygon(shape.coords, { color: shapes_color[i] }).addTo(this.map).bindPopup(shape.text);
        });
        this.atp45Results.push(shape_data);
    }

    private rectLayer(area: number[], options: L.PolylineOptions) : L.Layer {
        const corner1 = L.latLng(area[0], area[1]);
        const corner2 = L.latLng(area[2], area[3]);
        const bounds = L.latLngBounds(corner1, corner2);
        return L.rectangle(bounds, options);
    }

    layerToArea(layer: L.Rectangle) : number[] {
        const nw = layer.getBounds().getNorthWest();
        const se = layer.getBounds().getSouthEast();
        return [nw.lat, nw.lng, se.lat, se.lng];
    }

    newAvailableArea(area: number[]) {
        const rect = this.rectLayer(area, { interactive: false, fillOpacity: 0 });
        if (this.availableArea !== undefined) {
            this.map.removeLayer(this.availableArea)
        }
        this.availableArea = rect;
        this.availableArea.addTo(this.map)
    }

    removeAvailableArea() {
        if (this.availableArea !== undefined) {
            this.map.removeLayer(this.availableArea)
        }
    }

    newAreaSelection(rect: L.Rectangle) {
        if (this.areaSelection !== undefined) {
            this.map.removeLayer(this.areaSelection);
        }
        this.areaSelection = rect;
        this.areaSelection.addTo(this.map);
    }

    removeLayer(layer: L.Layer | undefined) {
        layer !== undefined && this.map.removeLayer(layer);
    }

    addHeatLayer(lons: number[], lats: number[], values: number[]) {
        let toPlot: L.HeatLatLngTuple[] = [];
        const max = Math.max(...values)
        values.map((e, i) => {
            toPlot.push(<any>[
                lats[i],
                lons[i],
                e/max
            ]);
        });
        const options = {
            radius : 1e10,
            // max: max
        };
        this.heatLayer = L.heatLayer(toPlot, options);

        // this.heatLayer = L.heatLayer([
        //     [50.5, 30.5, 0.2], // lat, lng, intensity
        //     [50.6, 30.4, 0.5],
        // ], {radius: 25})

        this.heatLayer.addTo(this.map);
    }

    addGeoJsonLayer(features: any) {
        let geojsonMarkerOptions = {
            radius: 0.5,
            // fillColor: "#ff7800",
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        let option: any = {
            pointToLayer: function (feature: any, latlng: L.LatLng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }

        this.info = new L.Control({position: 'topright'});
        this.info.onAdd = function (map: L.Map) {
            this._div = L.DomUtil.create('div', 'leaflet-info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        this.info.update = function (props:any) {
            this._div.innerHTML = '<h4>Concentration</h4>' +  (props ?
                '<b>' + props.conc + '</b>'
                : 'Hover over a cell');
        };

        let info = this.info
        function cellHover(e:L.LeafletMouseEvent) {
            let layer = e.target;
            info.update(layer.feature.properties)
        }

        function resetHover(e:L.LeafletMouseEvent) {
            info.update();
        }

        function onEachFeature(feature: any, layer: L.Layer) {
            layer.on({
                mouseover: cellHover,
                mouseout: resetHover,
            });
        }
        option.onEachFeature = onEachFeature;
        this.geojsonLayer = L.geoJSON(undefined, option).addTo(this.map);
        features.forEach((feature: any) => {
            this.geojsonLayer.addData(feature);
        });

        info.addTo(this.map);
    }

    addDrawControl() {
        L.drawLocal.draw.toolbar.buttons.rectangle = 'Area selection for data retrieval';
        L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Please select the area for data retrieval';
        var drawnItems = new L.FeatureGroup();
        this.map.addLayer(drawnItems);
        this.drawRectangleControl = new L.Control.Draw({
            draw: {
                polyline: false,
                polygon: false,
                circle: false,
                marker: false,
                circlemarker: false
            },
            edit: {
                featureGroup: drawnItems
            }
        });
        this.map.addControl(this.drawRectangleControl);
        this.map.on('draw:created', (e: any) => {
            this.newAreaSelection(e.layer)
        });
    }

    removeDrawControl() {
        this.drawRectangleControl !== undefined && this.map.removeControl(this.drawRectangleControl)
    }
}
