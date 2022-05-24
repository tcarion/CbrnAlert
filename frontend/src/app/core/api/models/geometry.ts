/* tslint:disable */
/* eslint-disable */
import { GeoJsonObject } from './geo-json-object';

/**
 * Abstract type for all GeoJSon object except Feature and FeatureCollection
 */
export type Geometry = GeoJsonObject & {
'type': 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon' | 'GeometryCollection';
};
