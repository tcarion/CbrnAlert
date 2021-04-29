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
}
