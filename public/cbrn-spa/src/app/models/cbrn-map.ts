import { Shape, ShapeData } from './../interfaces/atp45/shape-data';
import * as L from 'leaflet'
import 'leaflet-draw'

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
