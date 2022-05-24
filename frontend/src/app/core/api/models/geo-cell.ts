/* tslint:disable */
/* eslint-disable */
import { Feature } from './feature';
import { GeoCellProperties } from './geo-cell-properties';
import { Polygon } from './polygon';
export type GeoCell = Feature & {
'geometry'?: Polygon;
'properties'?: GeoCellProperties;
} & {
};
