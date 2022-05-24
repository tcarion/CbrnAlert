/* tslint:disable */
/* eslint-disable */
import { Feature } from './feature';
import { GeoJsonObject } from './geo-json-object';

/**
 * GeoJSon 'FeatureCollection' object
 */
export type FeatureCollection = GeoJsonObject & {
'features': Array<Feature>;
};
