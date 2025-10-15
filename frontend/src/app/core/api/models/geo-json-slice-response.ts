/* tslint:disable */
/* eslint-disable */
import { GeoJsonSliceResponseCollection } from './geo-json-slice-response-collection';
import { GeoJsonSliceResponseMetadata } from './geo-json-slice-response-metadata';
export interface GeoJsonSliceResponse {
  collection: GeoJsonSliceResponseCollection;
  metadata?: GeoJsonSliceResponseMetadata;
}
