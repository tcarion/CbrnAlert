/* tslint:disable */
/* eslint-disable */
import { Geometry } from './geometry';

/**
 * Abstract type for all GeoJSon 'Geometry' object the type of which is not 'GeometryCollection'
 */
export type GeometryElement = Geometry & {
'type': 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';
};
