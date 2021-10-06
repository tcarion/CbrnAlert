import { Feature, FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.heat';
import { MapPlot } from './map-plot';

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

const POINT_MARKER_OPTIONS = {
    radius: 2,
    fillColor: "black",
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

const REL_LOC_MARKER_OPTIONS = {
    radius: 5,
    fillColor: "red",
    color: "red",
    weight: 4,
    opacity: 1,
    fillOpacity: 1
};

abstract class AbstractPlots {
    plots: {
        id: number,
        layers: L.FeatureGroup,
        legendData?: any 
    }[] = [];

    getLayers(id: number) {
        return this.getPlot(id)?.layers;
    }

    getPlot(id: number) {
        return this.plots.find(el => el.id == id);
    }
    setActive(id: number) {}

    // add() {}

    // delete() {}

    delete(mapPlot: MapPlot) {
        this.plots = this.plots.filter(el => el.id !== mapPlot.id);
    }

}
class Atp45Plots extends AbstractPlots {

    constructor(private infoRef: any) {
        super()
    }

    getLayerFromShapes(shapes: FeatureCollection): L.FeatureGroup {
        let options: L.GeoJSONOptions = {
            pointToLayer: (feature: Feature, latlng: L.LatLng) => {
                return L.circleMarker(latlng, REL_LOC_MARKER_OPTIONS);
            },
            style: (feature: any) => {
                let opt = feature.properties.color ? {color: feature.properties.color} : {}
                return opt;
            },
            onEachFeature: (feature: Feature, layer: L.Layer) => {
                if (feature.properties) layer.bindPopup(feature.properties.text);
            }
        }

        let layer = L.geoJSON(undefined, options);

        shapes.features.forEach((feature) => {
            layer.addData(feature);
        });

        return layer;
        // this.geojsonLayers.push(layer);
        // layer.addTo(this.map);
    }

    add(mapPlot: MapPlot) {
        const newPlot = {
            id: mapPlot.id,
            layers: this.getLayerFromShapes(<FeatureCollection>mapPlot.geojson),
            legendData: mapPlot.metadata
        }

        newPlot.layers.on('click', (e) => {
            this.setActive(newPlot.id);
        })
        this.setActive(newPlot.id);
        this.plots.push(newPlot);
        return newPlot;
    }
}
class FlexpartPlots extends AbstractPlots {
    plots: {
        id: number,
        layers: L.FeatureGroup,
        legendData?: any 
    }[] = [];
    
    constructor(private legendRef: any, private infoRef: any) {
        super()
    }

    getLayerFromCells(cells: FeatureCollection[]): L.FeatureGroup {
        let options: L.GeoJSONOptions = {
            pointToLayer: function (feature: any, latlng: L.LatLng) {
                if (feature.properties.type === "releasePoint") {
                    return L.circleMarker(latlng, REL_LOC_MARKER_OPTIONS);
                }
                return L.circleMarker(latlng, POINT_MARKER_OPTIONS);
            },
            style: (feature: any) => {
                let options: L.PathOptions = {
                    stroke: false, 
                    fillOpacity: 0.4,
                }
                options = feature.properties ? {...options, color: feature.properties.color } : options
                return options;
            },
            // onEachFeature: (feature, layer) => {
            //     layer.on({
            //         'click': (e) => this.setActive(this.curPlot),
            //     })
            // }
            onEachFeature: this.cellHoverListener()
        };

        let layers = L.geoJSON(undefined, options);

        cells.forEach((feature: any) => {
            layers.addData(feature);
        });

        return layers;
    }

    getLayers(id: number) {
        return this.getPlot(id)?.layers;
    }

    getPlot(id: number) {
        return this.plots.find(el => el.id == id);
    }

    setActive(id: number) {
        const plot = this.getPlot(id);
        plot?.layers.setStyle({fillOpacity: 0.8});
        this.plots.filter(el => el.id !== id).forEach(el => el.layers.setStyle({fillOpacity: 0.4}));
        plot && this.legendRef.update(plot.legendData);
    }

    add(mapPlot: MapPlot) {
        const newPlot = {
            id: mapPlot.id,
            layers: this.getLayerFromCells(<FeatureCollection[]>mapPlot.geojson),
            legendData: mapPlot.metadata
        }

        // newPlot.layers.on('click', (e) => {
        //     this.setActive(newPlot.id);
        // })
        this.setActive(newPlot.id);
        this.plots.push(newPlot);
        return newPlot;
    }

    cellHoverListener() {
        let info = this.infoRef;
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
        return onEachFeature;
    }
}



export class CbrnMap {
    public map: L.Map;
    private markerLocation?: LonLat;
    private markerLayer?: L.Marker;
    // private atp45Results: ShapeData[] = [];
    public availableArea: L.Layer;
    public areaSelection: L.Rectangle;
    private drawRectangleControl?: L.Control;

    // private heatLayer: L.Layer;

    // private geojsonLayer: L.GeoJSON<any>;

    private flexpartPlots: FlexpartPlots;
    private atp45Plots: Atp45Plots;
    // private geojsonLayers: L.Layer[] = [];

    private info: any;
    private legend: any;

    curPlot: any;
    constructor() {
        this.createLegend();
        this.createInfo();

        this.flexpartPlots = new FlexpartPlots(this.legend, this.info);
        this.atp45Plots = new Atp45Plots(this.info);
    }

    mapInit(mapid: string, center: L.LatLngExpression, zoom: number) {
        this.map = L.map(mapid).setView(center, zoom);
        this.addTileLayer();

        this.legend.addTo(this.map);
        this.info.addTo(this.map);
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

    // addHeatLayer(lons: number[], lats: number[], values: number[]) {
    //     let toPlot: L.HeatLatLngTuple[] = [];
    //     const max = Math.max(...values)
    //     values.map((e, i) => {
    //         toPlot.push(<any>[
    //             lats[i],
    //             lons[i],
    //             e/max
    //         ]);
    //     });
    //     const options = {
    //         radius : 1e10,
    //         // max: max
    //     };
    //     this.heatLayer = L.heatLayer(toPlot, options);

    //     // this.heatLayer = L.heatLayer([
    //     //     [50.5, 30.5, 0.2], // lat, lng, intensity
    //     //     [50.6, 30.4, 0.5],
    //     // ], {radius: 25})

    //     this.heatLayer.addTo(this.map);
    // }

    // drawShapes(shape_data: any) {
    //     const shapes_color = ['blue', 'red', 'yellow']
    //     shape_data.shapes.forEach((shape: any, i: number) => {
    //         L.polygon(shape.coords, { color: shapes_color[i] }).addTo(this.map).bindPopup(shape.text);
    //     });
    //     // this.atp45Results.push(shape_data);
    // }


    // setIsActive(cells: FeatureCollection[], isActive: boolean) {
    //     cells.forEach((cell: any) => {
    //         cell.features[0].properties.active = isActive;
    //     })
    //     // layers.setStyle({fillOpacity: 0.8})
    // }

    // setActive(layer: any) {
    //     layer.setStyle({fillOpacity: 0.8})
    // }

    addAtp45Plot(mapPlot: MapPlot) {
        this.atp45Plots.add(mapPlot).layers.addTo(this.map);
    }

    hideAtp45Plot(mapPlot: MapPlot) {
        const layers = this.atp45Plots.getLayers(mapPlot.id);
        layers && this.map.removeLayer(layers);
    }

    showAtp45Plot(mapPlot: MapPlot) {
        const layers = this.atp45Plots.getLayers(mapPlot.id);
        layers && this.map.addLayer(layers);
    }

    deleteAtp45Plot(mapPlot: MapPlot) {
        const layers = this.atp45Plots.getLayers(mapPlot.id);
        layers && this.map.removeLayer(layers);
        this.flexpartPlots.delete(mapPlot);
    }

    addFlexpartPlot(mapPlot: MapPlot) {
        const newPlot = this.flexpartPlots.add(mapPlot);
        newPlot.layers.addTo(this.map);
        return newPlot;
    }

    hideFlexpartPlot(mapPlot: MapPlot) {
        const layers = this.flexpartPlots.getLayers(mapPlot.id);
        layers && this.map.removeLayer(layers);
    }

    showFlexpartPlot(mapPlot: MapPlot) {
        const layers = this.flexpartPlots.getLayers(mapPlot.id);
        layers && this.map.addLayer(layers);
    }

    setActive(mapPlot: MapPlot) {
        switch (mapPlot.type) {
            case 'atp45':
                this.atp45Plots.setActive(mapPlot.id)
                break;
            case 'flexpart':
                this.flexpartPlots.setActive(mapPlot.id)
                break;
        }
    }

    deleteFlexpartPlot(mapPlot: MapPlot) {
        const layers = this.flexpartPlots.getLayers(mapPlot.id);
        layers && this.map.removeLayer(layers);
        this.flexpartPlots.delete(mapPlot);
    }

    createInfo() {
        this.info = new L.Control({position: 'topright'});

        this.info.update = function (props:any) {
            while(this._div.firstChild){
                this._div.firstChild.remove();
            }
            let conc = props && parseFloat(props.value);
            const name = document.createElement('h4'); name.innerText = 'Cell value: ';
            let content;
            if (props) {
                content = document.createElement('b'); content.innerText = conc.toExponential(4)
            } else {
                content = document.createElement('span'); content.innerText = 'Hover over a cell';
            }
            this._div.append(name)
            this._div.append(content);

            // let conc = props && parseFloat(props.value);
            // this._div.innerHTML = '<h4>Concentration</h4>' +  (props ?
            //     '<b>' + conc.toExponential(4) + ' [ng/m3]</b>'
            //     : 'Hover over a cell');
        };

        this.info.onAdd = function (map: L.Map) {
            this._div = L.DomUtil.create('div', 'leaflet-info');
            return this._div;
        };
    }

    createLegend() {
        this.legend = new L.Control({position: 'bottomright'});

        this.legend.update = function (legendData: any) {
            // if (legendData === undefined) {return;}
            let colorbar = legendData.colorbar,
                ticksLabel = legendData.ticksLabel;
            ticksLabel = ticksLabel.map((e:number) => {return e.toExponential(2)});
            const specie = legendData.specie ? `(${legendData.specie})` : ''
            this._div.innerHTML = '';
            this._div.innerHTML = `<span> ${legendData.name} ${specie} [${legendData.units}]</span>`;
            for (var i = 0; i < colorbar.length; i++) {
                let span = (i===0) ? `<span class="legend-ticklabel">${ticksLabel[i]}</span>` : '';
                this._div.innerHTML +=
                    `<div>
                        <span class="ticks-container">
                            <span class="legend-ticklabel">${ticksLabel[i+1]}</span>
                            ${span}
                        </span>
                        <i style="background:${colorbar[i]}"></i>
                    </div>
                    `;
            }
        };

        this.legend.onAdd = function (map: L.Map) {
            this._div = L.DomUtil.create('div', 'leaflet-info legend');
            return this._div;
        }
    }

    updateLegend(legendData: any) {
        this.legend._div.innerHTML = '';
        this.legend.update(legendData);
    }



    // infoUpdateWithConc() {
        

    // }

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
