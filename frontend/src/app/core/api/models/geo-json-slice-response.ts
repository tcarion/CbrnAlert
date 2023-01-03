/* tslint:disable */
/* eslint-disable */
import { ColorbarData } from './colorbar-data';
import { FeatureCollection } from './feature-collection';
import { GeoCell } from './geo-cell';
export interface GeoJsonSliceResponse {
  collection: FeatureCollection & {
'features': Array<GeoCell>;
};
  metadata?: ColorbarData;
}
