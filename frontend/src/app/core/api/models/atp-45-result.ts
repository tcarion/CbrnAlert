/* tslint:disable */
/* eslint-disable */
import { Atp45ResultMetadata } from './atp-45-result-metadata';
import { Feature } from './feature';
import { FeatureCollection } from './feature-collection';
import { Polygon } from './polygon';
export interface Atp45Result {
  collection: FeatureCollection & {
'features'?: Array<Feature & {
'geometry'?: Polygon;
'properties'?: {
'type'?: string;
'shape'?: string;
};
}>;
};
  metadata?: Atp45ResultMetadata;
}
