/* tslint:disable */
/* eslint-disable */
import { GeoPoint } from './geo-point';
export interface BasicAtp45Input {
  containerId: string;

  /**
   * Array of release points
   */
  locations: Array<GeoPoint>;
  procedureTypeId: string;
}
