import { FeatureCollection } from 'geojson';
import { MapAction } from 'src/app/core/state/map.state';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { circle, Control, ControlOptions, DomUtil, DomEvent, Icon, icon, latLng, latLngBounds, Layer, Map as LeafletMap, marker, Marker, polygon, Rectangle, tileLayer, LayerGroup, FeatureGroup, TileLayer, LatLngBounds, control } from 'leaflet';
import { dynamicMapLayer, imageMapLayer, ImageMapLayer } from 'esri-leaflet';
import chroma from 'chroma-js';
import { ColorbarData } from 'src/app/core/api/models/colorbar-data';
import '@geoman-io/leaflet-geoman-free';
import { MapService } from 'src/app/core/services/map.service';
import { Select, Store } from '@ngxs/store';
import { Observable, firstValueFrom, of } from 'rxjs';
import { MapPlotState, MapPlotAction } from 'src/app/core/state/map-plot.state';
import { MapPlot } from 'src/app/core/models/map-plot';
import { map, tap, take } from 'rxjs/operators';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { prefix } from '@fortawesome/free-solid-svg-icons';
import { stat } from 'fs';

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

interface ThresholdControlOptions extends ControlOptions {
  collapsed?: boolean;
  checkboxState?: { [label: string]: boolean };
}

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
})
export class LeafletMapComponent implements OnInit {

  map: LeafletMap;
  layer: FeatureGroup | TileLayer;
  scalebar: Control.Scale | undefined;
  sameRender: boolean = false;
  popDensityLayer100m: ImageMapLayer;
  popDensityLayer1km: ImageMapLayer;
  currentThresholdCtrl: Control | null = null;
  thresholdControlList = new Map<string, { control: Control, collapsed: boolean, threshold: number | null, plotUnit: string, checkboxState: { [label: string]: boolean } }>();

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
    public flexpartService: FlexpartService,
    public store: Store
  ) {
  }

  ngOnInit(): void {
    this.activePlot$.subscribe(plot => {
      if (this.currentThresholdCtrl) {
        this.map.removeControl(this.currentThresholdCtrl);
        this.currentThresholdCtrl = null;
      }
      if (plot?.type == 'stats') {
        const mainPlot = plot.name.split(' - ')[0];
        const stored = this.thresholdControlList.get(mainPlot);
        if (stored) {
          this.currentThresholdCtrl = stored.control;
          this.currentThresholdCtrl.addTo(this.map);
        }
      }
      if (plot?.type == 'flexpart' && plot?.simType == 'ensemble') {
        const stored = this.thresholdControlList.get(plot.name);
        if (stored) {
          this.currentThresholdCtrl = stored.control;
          this.currentThresholdCtrl.addTo(this.map);
        } else {
          this.currentThresholdCtrl = this.createThresholdControl(plot);
          this.thresholdControlList.set(plot.name, {
            control: this.currentThresholdCtrl,
            collapsed: true,
            threshold: null,
            plotUnit: '',
            checkboxState: {}
          });
          this.currentThresholdCtrl.addTo(this.map);
        }
      }
    });
  }

  onMapReady(map: LeafletMap) {
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

  private createThresholdControl(plot: MapPlot, options: ThresholdControlOptions = {}): Control {
    const ThresholdControl = Control.extend({
      options: {
        collapsed: true,
        checkboxState: {}
      },

      onAdd: (map: LeafletMap) => {
        const storedCtrl = this.thresholdControlList.get(plot.name);
        const container = DomUtil.create('div', 'threshold-control');
        if (storedCtrl) {
          if (/spec\d+_mr/.test(plot.legendLayer)) {
            storedCtrl.plotUnit = 'ng/m³';
          } else if (/D_spec/.test(plot.legendLayer)) {
            storedCtrl.plotUnit = 'ng/m²';
          }
        }

        // Input field
        const inputWrapper = DomUtil.create('div', 'threshold-input-wrapper', container);
        const label = DomUtil.create('label', 'threshold-label', inputWrapper);
        label.innerText = 'Threshold value:';
        const input = DomUtil.create('input', 'threshold-input', inputWrapper) as HTMLInputElement;
        input.type = 'text';
        input.inputMode = 'decimal';
        if (storedCtrl && storedCtrl.threshold) {
          input.value = storedCtrl.threshold.toString();
        }

        // "Calculate statistics" button
        const calculateBtn = DomUtil.create('button', 'calculate-btn', container) as HTMLButtonElement;
        const statusWrapper = DomUtil.create('div', 'status-wrapper', container);
        calculateBtn.innerText = 'Calculate statistics';
        calculateBtn.disabled = true;

        // Toggle statistics plots button
        const optionsWrapper = DomUtil.create('div', '', container);
        const toggleBtn = DomUtil.create('button', 'toggle-checkboxes-btn', container) as HTMLButtonElement;
        let isVisible: boolean;
        if (storedCtrl) {
          optionsWrapper.style.display = storedCtrl.collapsed ? 'none' : 'block';
          toggleBtn.innerText = storedCtrl.collapsed ? '▼ Show results' : '▲ Hide results';
          isVisible = storedCtrl.collapsed ? false : true;
        }
        toggleBtn.addEventListener('click', () => {
          isVisible = !isVisible;
          if (storedCtrl) {
            storedCtrl.collapsed = !isVisible;
          }
          optionsWrapper.style.display = isVisible ? 'block' : 'none';
          toggleBtn.innerText = isVisible ? '▲ Hide results' : '▼ Show results';
        });

        // Logic behind "Calculate statistics" button
        input.addEventListener('input', () => {
          const value = parseFloat(input.value);
          const valid = !isNaN(value) && value > 0;
          calculateBtn.disabled = !valid;
          if (valid && storedCtrl) {
            storedCtrl.threshold = value;
          }
        });
        input.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter' && !calculateBtn.disabled) {
            calculateBtn.click();
          }
        });
        const items = ['percentage agreement', ...Array.from({ length: 9 }, (_, i) => `member ${i + 1}`), 'mean'];
        calculateBtn.addEventListener('click', () => {
          calculateBtn.disabled = true;
          checkboxes.forEach(cb => cb.disabled = true);
          checkboxes.forEach(cb => cb.checked = false);
          if (storedCtrl) {
            storedCtrl.checkboxState = {};
          }
          statusWrapper.innerHTML = '';
          const spinner = document.createElement('div');
          spinner.className = 'spinner';
          statusWrapper.appendChild(spinner);
          const statsItems = items.map(item => `${item} (${storedCtrl?.threshold} ${storedCtrl?.plotUnit})`);;
          this.flexpartService.getEnsembleStats(plot.fpOutputId!, plot.legendLayer, plot.dimsIndices!, parseFloat(input.value)).subscribe(
            result => {
              this.store.dispatch(new MapPlotAction.AddStatsTiff(result, 'stats', statsItems))
              statusWrapper.innerHTML = 'Done!';
              setTimeout(() => {
                statusWrapper.innerHTML = '';
              }, 3000);
              checkboxes.forEach(cb => cb.disabled = false);
              calculateBtn.disabled = true;
            }
          );
        });

        // List of checkboxes &
        // Logic behind clicking them
        const checkboxes: HTMLInputElement[] = [];
        items.forEach(labelText => {
          const checkboxWrapper = DomUtil.create('label', 'checkbox-wrapper', optionsWrapper);
          const checkbox = DomUtil.create('input', '', checkboxWrapper) as HTMLInputElement;
          checkbox.name = labelText;
          checkbox.type = 'checkbox';
          checkbox.disabled = true;
          checkbox.style.marginRight = '0.5vw';
          if (storedCtrl && storedCtrl.checkboxState[checkbox.name] == true) {
            checkbox.checked = storedCtrl.checkboxState[checkbox.name];
          }
          checkbox.addEventListener('change', () => {
            if (storedCtrl) {
              storedCtrl.checkboxState[checkbox.name] = checkbox.checked;
            }
            this.mapPlots$.pipe(take(1)).subscribe(mapPlots => {
              const statsPlot = mapPlots.find(p => p.name === plot.name + ' - ' + checkbox.name + ` (${storedCtrl?.threshold} ${storedCtrl?.plotUnit})`);
              if (statsPlot) {
                if (!statsPlot.visible) {
                  this.store.dispatch([ new MapPlotAction.Show(statsPlot.id) ]);
                  if (checkbox.name === 'percentage agreement') {
                    this.store.dispatch([ new MapPlotAction.SetActive(statsPlot.id) ]);
                  }
                } else {
                  this.store.dispatch(new MapPlotAction.Hide(statsPlot.id));
                }
              }
            });
          });
          checkboxes.push(checkbox);
          checkboxWrapper.appendChild(document.createTextNode(checkbox.name));
        });
        if (storedCtrl && storedCtrl.threshold) {
          checkboxes.forEach(cb => cb.disabled = false);
        }

        DomEvent.disableClickPropagation(container);
        return container;
      },

      onRemove: () => {}
    });

    return new ThresholdControl({position: 'topright'});
  }

}