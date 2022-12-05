import { Atp45Result } from 'src/app/core/api/v1';
import { GeoJsonSliceResponse } from 'src/app/core/api/v1';
import { Injectable } from '@angular/core';
import { MapPlot, PlotType } from '../models/map-plot';
import { MapService } from './map.service';
import { Feature, FeatureCollection } from 'geojson';
import { ColorbarData } from 'src/app/core/api/v1';
import { circle, circleMarker, FeatureGroup, geoJSON, LayerGroup } from 'leaflet';

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

  fillPlot(plotData: Atp45Result | GeoJsonSliceResponse, type: PlotType) {
    let newPlot = new MapPlot(type);

    newPlot.metadata = plotData.metadata
    newPlot.geojson = plotData.collection as FeatureCollection;
    return newPlot;
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

    layers.addData(collection as FeatureCollection);
    return layers;
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


  createMapPlot({ type, plotData }: any) {
    let mapPlot = this.fillPlot(plotData, type)
    return mapPlot;
  }
}
