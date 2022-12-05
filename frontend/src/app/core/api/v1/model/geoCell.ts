/**
 * CbrnAlert API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { GeoCellAllOfProperties } from './geoCellAllOfProperties';
import { Polygon } from './polygon';
import { Feature } from './feature';


export interface GeoCell extends Feature {
    geometry: Polygon;
    properties: GeoCellAllOfProperties;
}
export namespace GeoCell {
}


