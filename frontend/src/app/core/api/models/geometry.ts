/* tslint:disable */
/* eslint-disable */
import { GeoJsonObject } from './geo-json-object';
import { GeometryAllOf } from './geometry-all-of';

/**
 * Abstract type for all GeoJSon object except Feature and FeatureCollection
 */
export type Geometry = GeoJsonObject & GeometryAllOf;
