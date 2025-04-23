import { FeatureCollection } from 'geojson';
import { MapAction } from 'src/app/core/state/map.state';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { circle, Control, Icon, icon, latLng, latLngBounds, Layer, Map, marker, Marker, polygon, Rectangle, tileLayer, LayerGroup, FeatureGroup, TileLayer, LatLngBounds, control } from 'leaflet';
import { dynamicMapLayer, imageMapLayer, ImageMapLayer } from 'esri-leaflet';
import chroma from 'chroma-js';
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
  sameRender: boolean = false;
  popDensityLayer100m: ImageMapLayer;
  popDensityLayer1km: ImageMapLayer;

  options = {
    attributionControl: false, // Disable the default attribution control
  };

  @Select(MapPlotState.mapPlots) mapPlots$: Observable<MapPlot[]>;
  @Select(MapPlotState.activePlot) activePlot$: Observable<MapPlot>;

  renderingRule = {
    "rasterFunction": "Stretch",
    "rasterFunctionArguments": {
      "StretchType": 9,
      "SigmoidStrengthLevel": 1,
      "Min": 0,
      "Max": 60000
    }
  };

  layersControl = {
    baseLayers: {
      'ESRI Satellite Map': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, detectRetina: true, attribution: 'Esri, USGS | Esri, TomTom, Garmin, FAO, NOAA, USGS | Earthstar Geographics' }),
      'ESRI Topographic Map': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, detectRetina: true, attribution: 'Esri, USGS | FOEN / Swiss Parks Network, swisstopo, Esri, TomTom, Garmin, FAO, NOAA, USGS | Esri, HERE, Garmin, FAO, NOAA, USGS' }),
      'Open Street Map': tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' })
    },
    overlays: {
      'Add boundaries & names': dynamicMapLayer({url: 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer', opacity: 0.6, attribution: 'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, GIS user community' }),
      'Add population density (1 km)': imageMapLayer({url: 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_1km/ImageServer', opacity: 0.4, from: new Date('2020'), to: new Date('2020'), renderingRule: this.renderingRule, minZoom: 7, attribution: 'WorldPop, Esri'}),
      'Add population density (100 m)': imageMapLayer({url: 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_100m/ImageServer', opacity: 0.4, from: new Date('2020'), to: new Date('2020'), renderingRule: this.renderingRule, minZoom: 9, attribution: 'WorldPop, Esri'})
    }
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
    this.layersControl.overlays = {
      ... this.layersControl.overlays,
      ... overlayLayers
    }
  }

  onMapReady(map: Map) {
    this.mapService.leafletMap = map;
    this.map = map;
    // Initial map settings at startup
    map.fitBounds(latLngBounds(latLng(57, -15), latLng(43, 33)));
    this.layersControl.baseLayers['ESRI Satellite Map'].addTo(map);
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
    // Name population density layers
    this.popDensityLayer100m = this.layersControl.overlays['Add population density (100 m)'];
    this.popDensityLayer1km = this.layersControl.overlays['Add population density (1 km)'];

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

    map.on('moveend', async () => {
      if ((map.hasLayer(this.layersControl.overlays['Add population density (1 km)']) && map.getZoom() >= 7) ||
          (map.hasLayer(this.layersControl.overlays['Add population density (100 m)']) && map.getZoom() >= 9)) {   // Only trigger the function if a pop density layer has been clicked
        await updateRenderingRule();
      }
    });

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

    map.on('overlayadd', async (e) => {
      setTimeout(async () => {  // Ensure Leaflet completes layer changes before updating checkboxes
        if (e.layer === this.popDensityLayer1km) {
          if (map.hasLayer(this.popDensityLayer100m)) {
            map.removeLayer(this.popDensityLayer100m);
            updateCheckboxState('Add population density (100 m)', false);
          }
          await updateRenderingRule();
          // this.popDensityLayer1km.bindPopup((layer: ImageMapLayer) => {
          //   return "Population Density: " + this.popDensityLayer1km.pixel.properties.value + " people/km²";
          // });
        } else if (e.layer === this.popDensityLayer100m) {
          if (map.hasLayer(this.popDensityLayer1km)) {
            map.removeLayer(this.popDensityLayer1km);
            updateCheckboxState('Add population density (1 km)', false);
          }
          await updateRenderingRule();
        }
      }, 50);  // Small delay allows Leaflet to fully process layer toggling
    });
    
    // Helper function to update checkbox state dynamically
    function updateCheckboxState(layerName: string, checked: boolean) {
      const labels = document.querySelectorAll('.leaflet-control-layers label');
      labels.forEach((label) => {
        if (label.textContent?.trim() === layerName) {
          const checkbox = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
          if (checkbox) checkbox.checked = checked;
        }
      });
    }

    this.mapPlots$.subscribe(mapPlots => {
      this.updateOverlays(mapPlots);
    });

    // Simulate a click event on the default layer control button such that Esri Satellite Imagery in the Layers icon appears as clicked by default
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

    // Function to update the Pop Density layer's rendering rule dynamically
    const updateRenderingRule = async (): Promise<void> => {
      const bounds = map.getBounds();
      const maxValue = await fetchRegionMax(bounds);
      let renderMax: number;
      if (maxValue > 30000) {
        renderMax = maxValue + 0.1*maxValue;
      } else if (maxValue <= 30000 && maxValue > 5000) {
        renderMax = maxValue + 0.2*maxValue;
      } else {
        renderMax = maxValue + 0.3*maxValue;
      }
      if (renderMax === this.renderingRule.rasterFunctionArguments.Max) {
        this.sameRender = true;
      } else {
        this.sameRender = false;
        this.renderingRule.rasterFunctionArguments.Max = renderMax;
      }
      if (!this.sameRender) {
        if (map.hasLayer(this.layersControl.overlays['Add population density (1 km)'])) {
          this.layersControl.overlays['Add population density (1 km)'].redraw();
        } else if (map.hasLayer(this.layersControl.overlays['Add population density (100 m)'])) {
          this.layersControl.overlays['Add population density (100 m)'].redraw();
        }
      }
    };

    // Function to query World Pop Image Server API for Max value inside bounds
    const fetchRegionMax = async (bounds: L.LatLngBounds): Promise<number> => {
      let statsQueryUrl: string;
      if (map.hasLayer(this.layersControl.overlays['Add population density (100 m)'])) {
        statsQueryUrl = 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_100m/ImageServer/computeStatisticsHistograms';
      } else {
        statsQueryUrl = 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_1km/ImageServer/computeStatisticsHistograms';
      }
      const params = {
        geometryType: 'esriGeometryEnvelope',
        geometry: JSON.stringify({
          xmin: bounds.getWest(),
          ymin: bounds.getSouth(),
          xmax: bounds.getEast(),
          ymax: bounds.getNorth(),
          spatialReference: { wkid: 4326 }
        }),
        mosaicRule: '',
        renderingRule: '',
        pixelSize: '',
        f: 'json'
      };
      const response = await fetch(`${statsQueryUrl}?${new URLSearchParams(params)}`);
      const data = await response.json();
      return data.statistics[0].max; // Extract the max value
    };

    /////  IF WE WANT 1 POP DENSITY LAYER THAT AUTOMATICALLY CHANGES BETWEEN 1 KM AND 100 M RESOLUTION /////
    // map.on('overlayadd', (e) => {
    //   if (e.layer === this.layersControl.overlays['Add population density']) {
    //     updatePopDensityLayer();
    //   }
    // });
    //
    // const updatePopDensityLayer = () => {
    //   if (map.hasLayer(this.layersControl.overlays['Add population density'])) {
    //     if (map.getZoom() >= 9) {
    //       map.removeLayer(this.layersControl.overlays['Add population density']);
    //       this.layersControl.overlays['Add population density'] = imageMapLayer({url: 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_100m/ImageServer', opacity: 0.5, from: new Date('2020'), to: new Date('2020'), renderingRule: this.renderingRule, minZoom: 9, attribution: 'WorldPop, Esri'});
    //        map.addLayer(this.layersControl.overlays['Add population density']);
    //     } else {
    //       map.removeLayer(this.layersControl.overlays['Add population density']);
    //       this.layersControl.overlays['Add population density'] = imageMapLayer({url: 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Population_Density_1km/ImageServer', opacity: 0.5, from: new Date('2020'), to: new Date('2020'), renderingRule: this.renderingRule, minZoom: 7, attribution: 'WorldPop, Esri'});
    //       map.addLayer(this.layersControl.overlays['Add population density']);
    //     }
    //   }
    // }
    
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