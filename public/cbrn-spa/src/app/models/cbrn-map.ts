import { Shape, ShapeData } from './../interfaces/atp45/shape-data';
import * as L from 'leaflet'

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
    public map: any;
    private markerLocation: LonLat | undefined;
    private markerLayer: L.Marker | undefined;
    private atp45Results: ShapeData[] = [];
    private availableArea: L.Layer;

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
        return this.markerLocation === undefined ?  undefined : this.markerLocation;
    }

    set marker(lonlat: LonLat | undefined) {
        this.markerLocation = lonlat;
        if (lonlat=== undefined) {
            this.map.removeLayer(this.markerLayer)
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

    newAvailableArea(area: number[]) {
        const corner1 = L.latLng(area[0], area[1]);
        const corner2 = L.latLng(area[2], area[3]);
        const bounds = L.latLngBounds(corner1, corner2);
        const options = { interactive: false, fillOpacity: 0 };
        const rect = L.rectangle(bounds, options);
        if (this.availableArea !== undefined) {
            this.map.removeLayer(this.availableArea)
        }
        this.availableArea = rect;
        this.availableArea.addTo(this.map)
    }
}
