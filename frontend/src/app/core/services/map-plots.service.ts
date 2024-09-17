import { Atp45Result } from './../api/models/atp-45-result';
import { GeoJsonSliceResponse } from './../api/models/geo-json-slice-response';
import { Injectable } from '@angular/core';
import { MapPlot, PlotType } from '../models/map-plot';
import { MapService } from './map.service';
import { Feature, FeatureCollection } from 'geojson';
import { ColorbarData } from '../api/models';
import { circle, circleMarker, FeatureGroup, geoJSON, LayerGroup } from 'leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import chroma from 'chroma-js';
import { actionMatcher } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';


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

  constructor(
    private mapService: MapService,
  ) { }

  fillPlotGeoJSON(plotData: Atp45Result | GeoJsonSliceResponse, type: PlotType) {
    let newPlot = new MapPlot(type);

    newPlot.metadata = plotData.metadata
    newPlot.geojson = plotData.collection as FeatureCollection;
    return newPlot;
  }

  async fillPlotTiff(plotData: Blob, type: PlotType) {
    const arrayBuffer = await plotData.arrayBuffer()
    const geoRaster = await parseGeoraster(arrayBuffer);
    let newPlot = new MapPlot(type);
    console.log(geoRaster);
    newPlot.data = geoRaster;
    newPlot.metadata = this._colorbarFromGeoRaster(geoRaster)
    return newPlot
  }

  addTiff(geoRaster: any) {
    console.log(geoRaster)
    // inspired from https://github.com/GeoTIFF/georaster-layer-for-leaflet-example/blob/master/examples/color-scale.html

    const unit: string = "becquerel";
    const output: string = "deposition";
    let min: number;
    let max: number;
    let activity: number;
    const length = 10;
    let ticks: number[] = [];
    let ticks_depo: number[] = [];
    let ticks_mr: number[] = [];
    let scale: chroma.Scale;

    if (unit == "becquerel"){
      activity = 3.215; // kBq in 1 ng of caesium-137
      min = geoRaster.mins[0] * activity;
      max = geoRaster.maxs[0] * activity;
      ticks_depo = [0, 2, 4, 10, 20, 40, 100, 185, 555, 1480]; // ticks used in similar papers for deposition in kBq/m^2
      ticks_mr = [0, 1, 2, 5, 10, 15, 25, 40, 100, 300]; // ticks used in similar papers for mixing ratio in kBq/m^3
      ticks = ticks_depo;
    } else {
      min = 0.001;
      max = geoRaster.maxs[0];
      let step = Math.pow(max / min, 1 / (length - 1));
      for (let i = 0; i < length; i++) {
        let tick = min * Math.pow(step, i)
        ticks.push(tick);
      }
    }
    if (output == "deposition"){
      scale = this._colorScale_depo().domain(ticks.slice().reverse());
    }
    else {
      scale = this._colorScale_mr().domain(ticks.slice().reverse());
    }

    const imageryLayer = new GeoRasterLayer({
      georaster: geoRaster,
      pixelValuesToColorFn: pixelValues => {
        let pixelValue = pixelValues[0] * activity; // there's just one band in this raster

        if (pixelValue === 0) return "";
        let color = scale(pixelValue).hex();
        return color;
      },
      resolution: 256,
      opacity: 0.8
    });

    return imageryLayer as typeof GeoRasterLayer;
  }

  _colorScale_mr() {
    return chroma.scale("Spectral");
  }
  _colorScale_depo() {
    return chroma.scale(['800000', 'F0E68C']);
  }

  _colorbarFromGeoRaster(geoRaster: any, length = 10): ColorbarData {
    const unit: string = "becquerel";
    const output: string = "deposition";
    let min: number;
    let max: number;
    let activity: number;
    let ticks: number[] = [];
    let ticks_depo: number[] = [];
    let ticks_mr: number[] = [];
    let colors: string[] = [];
    let scale: chroma.Scale;

    if (unit == "becquerel"){
      activity = 3.215; // kBq in 1 ng of caesium-137
      min = geoRaster.mins[0] * activity;
      max = geoRaster.maxs[0] * activity;
      ticks_depo = [0, 2, 4, 10, 20, 40, 100, 185, 555, 1480]; // ticks used in similar papers for deposition in kBq/m^2
      ticks_mr = [0, 1, 2, 5, 10, 15, 25, 40, 100, 300]; // ticks used in similar papers for mixing ratio in kBq/m^3
      ticks = ticks_depo;
    } else {
      min = 0.001;
      max = geoRaster.maxs[0];
      let step = Math.pow(max / min, 1 / (length - 1));
      for (let i = 0; i < length; i++) {
        let tick = min * Math.pow(step, i)
        ticks.push(tick);
      }
    }
    if (output == "deposition"){
      scale = this._colorScale_depo().domain(ticks.slice().reverse());
    }
    else {
      scale = this._colorScale_mr().domain(ticks.slice().reverse());
    }
    for (let i = 0; i < length; i++){
      colors.push(scale(ticks[i]).hex())
    }
    //colors.shift()
    return {
      colors,
      ticks
    };
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
    // let options: L.GeoJSONOptions = {
    //     pointToLayer: function (feature: any, latlng: L.LatLng) {
    //         if (feature.properties.type === "releasePoint") {
    //             return circleMarker(latlng, REL_LOC_MARKER_OPTIONS);
    //         }
    //         return circleMarker(latlng, POINT_MARKER_OPTIONS);
    //     },
    //     style: (feature: any) => {
    //         let options: L.PathOptions = {
    //             stroke: false,
    //             fillOpacity: 0.4,
    //         }
    //         options = feature.properties ? {...options, color: feature.properties.color } : options
    //         return options;
    //     },
    // };

    let layers = geoJSON(undefined, {
      pmIgnore: true
    });
    let featureGroup = new FeatureGroup()
    layers.addData(collection as FeatureCollection);
    featureGroup.addLayer(layers)
    return featureGroup;
  }

  atp45PlotToLayer(collection: FeatureCollection) {
    let options: L.GeoJSONOptions = {
      pointToLayer: function (feature: any, latlng: L.LatLng) {
        if (feature.properties.type === "releasePoint") {
          return circleMarker(latlng, REL_LOC_MARKER_OPTIONS);
        }
        return circleMarker(latlng, POINT_MARKER_OPTIONS);
      },
      style: (feature: any) => {
        let options: L.PathOptions = {
          // stroke: false,
          fillOpacity: 0.4,
        }
        options = feature.properties.type == "release" ? { ...options, color: "red" } : options
        return options;
      },
    };
    let geojson = geoJSON(undefined, {
      pmIgnore: true,
      ...options
    });
    let featureGroup = new FeatureGroup()
    geojson.addData(collection as FeatureCollection);
    featureGroup.addLayer(geojson)
    // return layers as LayerGroup
    return featureGroup
  }


  createMapPlotGeoJSON({ type, plotData }: any) {
    let mapPlot = this.fillPlotGeoJSON(plotData, type)
    return mapPlot;
  }

  createMapPlotTiff({ type, plotData }: any) {
    let mapPlot = this.fillPlotTiff(plotData, type)
    return mapPlot;
  }
}
