import { GeoJsonSliceResponse } from './../api/models/geo-json-slice-response';
import { Injectable } from '@angular/core';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { MapPlot, PlotType } from '../models/map-plot';
import { tap } from 'rxjs/operators';
import { MapService } from './map.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Atp45ShapeData } from 'src/app/atp45/shape-data';
import { FlexpartPlotData } from 'src/app/flexpart/flexpart-plot-data';
import { Feature, FeatureCollection } from 'geojson';
import { ColorbarData } from '../api/models';
import { circle, circleMarker, geoJSON, LayerGroup } from 'leaflet';

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

type MapPlotCount = {
    [K in PlotType]: number;
}

function getColor(value: number, colorbar: ColorbarData) {
  let ticks = colorbar.ticks as number[];
  let colors = colorbar!.colors as string[];
  let n = ticks.length;
  if (value <= ticks[0]) {
      return colors[0];
  }
  for (let i = 1; i < n; i++) {
      if (value <= ticks[i]) {
          return colors[i - 1];
      }
  }
  return colors[n - 2];
}

@Injectable({
    providedIn: 'root'
})
export class MapPlotsService {
    // mapPlots: MapPlot[] = plots;

    // mapPlotsSubject = new BehaviorSubject<MapPlot[]>([]);
    // mapPlots$ = this.mapPlotsSubject.asObservable();

    plotsCount: MapPlotCount = {
        'atp45': 0,
        'flexpart': 0,
    }
    count = 0;

    constructor(
        private mapService: MapService,
    ) { }

    createPlot(type: PlotType, info?: Object): MapPlot {
        this.plotsCount[type]++;
        this.count++;
        const newPlot = {
            type,
            name: "Plot " + this.plotsCount[type],
            id: this.count,
            info: info,
            visible: true,
            isActive: true,
        }
        // this.mapPlots.push(newPlot);
        return newPlot;
    }

    createAtp45Plot(atp45ShapeData:Atp45ShapeData) {
        let newPlot = this.createPlot('atp45', {startDate: atp45ShapeData.date});
        newPlot.geojson = atp45ShapeData.shapes;
        // let layer = this.mapService.geoJson2Layer(atp45ShapeData.shapes);
        // newPlot.layer = layer;
        this.mapService.addPlotToMap(newPlot);
        return newPlot;
        // this.emitPlots();
    }

    createFlexpartPlot(flexpartPlotData: GeoJsonSliceResponse) {
        // let newPlot = this.createPlot('flexpart', flexpartPlotData.flexpartResult);
        let newPlot = this.createPlot('flexpart');
        // newPlot.isActive = true;
        newPlot.metadata = flexpartPlotData.metadata as ColorbarData;
        newPlot.geojson = flexpartPlotData.collection as FeatureCollection;
        // newPlot.layer = this.flexpartPlotToLayer(flexpartPlotData)
        // this.mapService.addPlotToMap(newPlot);
        return newPlot;
        // this.emitPlots();
    }

    setColors(layers: LayerGroup, colorbar: ColorbarData) {
      layers.eachLayer((layer: any) => {
        let val = layer.feature.properties.val;
        if (val !== undefined) {
          layer.setStyle({
            color: getColor(val, colorbar),
          });
        }
      });
    }

    flexpartPlotToLayer(collection: FeatureCollection) {
        let options: L.GeoJSONOptions = {
            pointToLayer: function (feature: any, latlng: L.LatLng) {
                if (feature.properties.type === "releasePoint") {
                    return circleMarker(latlng, REL_LOC_MARKER_OPTIONS);
                }
                return circleMarker(latlng, POINT_MARKER_OPTIONS);
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

            // Update the info box with the cell value
            // onEachFeature: this.cellHoverListener()
        };

        let layers = geoJSON(undefined, {
          // ...options,
          pmIgnore: true
        });

        // cells.forEach((feature: any) => {
        //     layers.addData(feature);
        // });

        layers.addData(collection as FeatureCollection);
        // let layers = circle([ 46.95, 4 ], { radius: 5000 })
        // return layers;
        return layers;
    }


    createMapPlot({type, plotData}: any) {
        let mapPlot;
        switch (type) {
            case 'atp45':
                mapPlot = this.createAtp45Plot(plotData);
                break;
            case 'flexpart':
                mapPlot = this.createFlexpartPlot(plotData);
                break;
        }
        return mapPlot as MapPlot;
    }

    hideMapPlot(plot: MapPlot): void {
        this.mapService.hidePlotFromMap(plot);
    }

    showMapPlot(plot: MapPlot): void {
        this.mapService.showPlotToMap(plot);
    }

    setActive(plot: MapPlot): void {
        this.mapService.setActive(plot);
    }

    deleteMapPlot(plot: MapPlot): void {
        this.mapService.deletePlot(plot);
        // this.mapPlots = this.mapPlots.filter(p => p !== plot);
    }
}
