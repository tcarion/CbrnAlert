/* tslint:disable */
/* eslint-disable */
import { Atp45ZoneProperties } from './atp-45-zone-properties';
import { Feature } from './feature';
import { Polygon } from './polygon';
export type Atp45Zone = Feature & {
'properties': Atp45ZoneProperties;
'geometry': Polygon;
};
