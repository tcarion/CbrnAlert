import { FeatureCollection } from 'geojson';
import { MapAction } from 'src/app/core/state/map.state';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { circle, Control, Icon, icon, latLng, latLngBounds, Layer, Map, marker, Marker, polygon, Rectangle, tileLayer, LayerGroup, FeatureGroup, TileLayer, LatLngBounds, control } from 'leaflet';
import { ColorbarData } from 'src/app/core/api/models/colorbar-data';
import '@geoman-io/leaflet-geoman-free';
import { MapService } from 'src/app/core/services/map.service';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { MapPlotState } from 'src/app/core/state/map-plot.state';
import { MapPlot } from 'src/app/core/models/map-plot';
import { map, tap } from 'rxjs/operators';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { prefix } from '@fortawesome/free-solid-svg-icons';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent implements OnInit {

  map: Map;
  layer: FeatureGroup | TileLayer;
  scalebar: Control.Scale | undefined;

  options = {
    attributionControl: false, // Disable the default attribution control
  };

  @Select(MapPlotState.mapPlots) mapPlots$: Observable<MapPlot[]>;
  @Select(MapPlotState.activePlot) activePlot$: Observable<MapPlot>;

  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      'ESRI Topographic Map': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, detectRetina: true, attribution: 'Esri, USGS | FOEN / Swiss Parks Network, swisstopo, Esri, TomTom, Garmin, FAO, NOAA, USGS | Esri, HERE, Garmin, FAO, NOAA, USGS' }),
      'ESRI Satellite Map': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, detectRetina: true, attribution: 'Esri, USGS | Esri, TomTom, Garmin, FAO, NOAA, USGS | Earthstar Geographics' })
    },
    overlays: {}
  }

  constructor(
    public mapService: MapService,
    public mapPlotsService: MapPlotsService,
    public store: Store
  ) {
  }

  ngOnInit(): void {
    this.mapPlots$.subscribe(mapPlots => {
      this.updateOverlays(mapPlots);
    });
  }

  updateOverlays(mapPlots: MapPlot[]) {
    const overlayLayers: { [key: string]: Layer } = {};
    mapPlots.forEach(mapPlot => {
      if (mapPlot.type == 'flexpart' && mapPlot.geojson) {
        this.layer = this.mapPlotsService.flexpartPlotToLayer(mapPlot.geojson as FeatureCollection);
        this.mapPlotsService.setColors(this.layer as LayerGroup, mapPlot.metadata as ColorbarData);
      } else if (mapPlot.type == 'flexpart') {
        this.layer = this.mapPlotsService.addTiff(mapPlot.data) as unknown as TileLayer;
      } else if (mapPlot.type == 'atp45') {
        let featureGroup = this.mapPlotsService.atp45PlotToLayer(mapPlot.geojson as FeatureCollection);
        featureGroup.eachLayer((layers: any) => {
          layers.eachLayer((layer: any) => {
            layer.bindPopup(layer.feature.properties.type);
          });
        });
        this.layer = featureGroup;
      }
      overlayLayers[mapPlot.name] = this.layer;
    });
    this.layersControl.overlays = overlayLayers;

  }

  onMapReady(map: Map) {
    this.mapService.leafletMap = map;
    this.map = map;
    // Initial map settings at startup
    map.fitBounds(latLngBounds(latLng(57, -15), latLng(43, 33)));
    this.layersControl.baseLayers['Open Street Map'].addTo(map);
    control.attribution({
      prefix: false, // Remove the default 'Leaflet' prefix
    }).addTo(map);
    // Inialize scale bar based on screen resolution
    this.getScalebar();
    // If screen resolution changes, get new scale bar
    window.addEventListener('resize', () => {
      this.getScalebar();
    });
    // Setting the zoom options
    map.options.zoomDelta = 1;
    map.options.zoomSnap = 1;
    map.options.wheelPxPerZoomLevel	= 0.1 * window.innerWidth;

    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: false,
      drawText: false,
      cutPolygon: false,
      rotateMode: false,
      editMode: false,
    });
    map.pm.enableDraw('Marker', { continueDrawing: false });
    map.pm.disableDraw();
    map.pm.setGlobalOptions({
      markerStyle: {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png',
          iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png'
        })
      }
    })

    map.on('pm:create', (e) => {
      if (e.shape == 'Rectangle') {
        const newLayer = e.layer as Rectangle
        const previousLayer = this.mapService.drawnRectangle;

        if (previousLayer) {
          this.store.dispatch(new MapAction.ChangeAreaSelection(this.mapService.rectangleToArea(newLayer)));
          this.mapService.leafletMap.removeLayer(newLayer)
        } else {
          this.mapService.drawnRectangle = newLayer
          this.store.dispatch(new MapAction.ChangeAreaSelection(this.mapService.rectangleToArea(newLayer)));
          this.mapService.drawnRectangle.on('pm:edit', (e: any) => {
            this.store.dispatch(new MapAction.ChangeAreaSelection(this.mapService.rectangleToArea(e.layer as Rectangle)));
          })
        }
      } else if (e.shape == 'Marker') {
        // Change the current marker if exists, and create it if not
        const newLayer = e.layer as Marker
        const previousLayer = this.mapService.drawnMarker;
        if (previousLayer) {
          // this.mapService.copyMarkerPosition(newLayer);
          this.store.dispatch(new MapAction.ChangeMarker(this.mapService.markerToPoint(newLayer)));
          this.mapService.leafletMap.removeLayer(newLayer)
        } else {
          this.mapService.drawnMarker = newLayer
          this.store.dispatch(new MapAction.ChangeMarker(this.mapService.markerToPoint(e.layer as Marker)));
          this.mapService.drawnMarker.on('pm:edit', (e: any) => {
            this.store.dispatch(new MapAction.ChangeMarker(this.mapService.markerToPoint(e.layer as Marker)));
          })
        }
      }
    })

    // Listen to when user selects another layer, to remove the default layer attribution that otherwise stays for other layers
    map.on('baselayerchange', (e) => {
      const layersControl: { [key: string]: TileLayer } = this.layersControl.baseLayers;
      const baseLayerName = Object.keys(layersControl)[0];
      if (baseLayerName && layersControl[baseLayerName]) { // have to check if they exist otherwise Typescript isn't sure the variables exist in the following conditions and returns an error
        const baseLayerAttribution = layersControl[baseLayerName].options.attribution;
        if (e.name !== baseLayerName, baseLayerAttribution) { // when on the default layer, and changing to another one
          const attributionControl = this.map.attributionControl;
          attributionControl.removeAttribution(baseLayerAttribution); // remove the attribution from the default layer
        }
      }
    })

    this.mapPlots$.subscribe(mapPlots => {
      this.updateOverlays(mapPlots);
    });

    // Simulate a click event on the default layer control button such that OpenStreetMap in the Layers icon appears as clicked by default
    setTimeout(() => {
      const layersControlContainer = document.querySelector('.leaflet-control-layers');
      if (layersControlContainer) {
        const defaultLayerInput = layersControlContainer.querySelectorAll('input[type="radio"]')[0] as HTMLInputElement;
        if (defaultLayerInput) {
          defaultLayerInput.checked = true;
          defaultLayerInput.dispatchEvent(new Event('change'));
        }
      }
    }, 0);

  }

    // Function to create/update scale bar depending on screen resolution
    private getScalebar() {
      // remove existing scale bar if it exists
      if (this.scalebar) {
        this.map.removeControl(this.scalebar);
      }
      // add scale bar with updated maxWidth
      const maxWidth = 0.07 * window.innerWidth;
      this.scalebar = new Control.Scale({
        position: 'bottomleft',
        maxWidth: maxWidth,
        metric: true,
        imperial: false,
      }).addTo(this.map);
    }

}