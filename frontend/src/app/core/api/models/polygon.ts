/* tslint:disable */
/* eslint-disable */
import { GeometryElement } from './geometry-element';
import { LinearRing } from './linear-ring';

/**
 * GeoJSon geometry
 */
export type Polygon = GeometryElement & {
'coordinates': Array<LinearRing>;
};
