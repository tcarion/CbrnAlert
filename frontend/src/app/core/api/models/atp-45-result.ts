/* tslint:disable */
/* eslint-disable */
import { CbrnTypes } from './cbrn-types';
import { Feature } from './feature';
import { Polygon } from './polygon';
export type Atp45Result = Feature & {
'geometry'?: Polygon;
'properties'?: CbrnTypes;
};
