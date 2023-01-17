/* tslint:disable */
/* eslint-disable */
import { Atp45Zone } from './atp-45-zone';
import { FeatureCollection } from './feature-collection';
export interface Atp45Result {
  collection: FeatureCollection & {
'features': Array<Atp45Zone>;
};
  metadata?: {
};
}
