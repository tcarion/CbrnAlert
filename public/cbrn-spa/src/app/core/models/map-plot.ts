import { FeatureCollection } from "geojson";

export type PlotType = 'atp45' | 'flexpart';

export interface MapPlot {
    type: PlotType,
    name: string,
    id: number,
    geojson?: FeatureCollection | FeatureCollection[],
    // layer?: L.Layer,
    info?: Object,
    visible: boolean,
    isActive?: boolean,
    metadata?: Object
}
