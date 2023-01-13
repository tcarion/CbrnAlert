import { FeatureCollection } from "geojson";
import { FlexpartResult } from "src/app/flexpart/flexpart-result";

export interface FlexpartPlotData {
    flexpartResult: FlexpartResult,
    cells: FeatureCollection,
    legendData: {colorbar: string, ticksLabel: any}
}

export enum SliceResponseType {
  GEOJSON = 'geojson',
  GEOTIFF = 'geotiff',
}
