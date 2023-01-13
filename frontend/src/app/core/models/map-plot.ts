import { FeatureCollection } from "geojson";

export type PlotType = 'atp45' | 'flexpart';

type PlotCount = {
  [K in PlotType]: number;
}

export interface MapPlot {
  type: PlotType,
  name: string,
  id: number,
  // TODO: make it parametric
  data?: any,
  geojson?: FeatureCollection | FeatureCollection[],
  // layer?: L.Layer,
  // info?: Object,
  visible: boolean,
  isActive: boolean,
  metadata?: Object
}

export class MapPlot implements MapPlot {

  static plotsCount : PlotCount = {
    'atp45': 1,
    'flexpart': 1,
  }
  static _id = 0;

  name: string;
  visible = true;
  isActive = true;

  constructor(public type: PlotType, ) {
    this.name = "Plot " + MapPlot.plotsCount[type]
    this.id = MapPlot._id;

    MapPlot._id++;
    MapPlot.plotsCount[type]++;

  }
}
