/* tslint:disable */
/* eslint-disable */
import { GeoJsonObject } from './geo-json-object';
import { Geometry } from './geometry';

/**
 * GeoJSon 'Feature' object
 */
export type Feature = GeoJsonObject & {
'geometry': any & Geometry;
'properties': {
} | null;
'id'?: (number | string);
};
