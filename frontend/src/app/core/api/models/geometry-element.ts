/* tslint:disable */
/* eslint-disable */
import { Geometry } from './geometry';
import { GeometryElementAllOf } from './geometry-element-all-of';

/**
 * Abstract type for all GeoJSon 'Geometry' object the type of which is not 'GeometryCollection'
 */
export type GeometryElement = Geometry & GeometryElementAllOf;
