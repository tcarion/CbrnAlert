/* tslint:disable */
/* eslint-disable */
import { GeoRectangle } from './geo-rectangle';

/**
 * Simplified data structure needed for a retrieval of meteorological data for Flexpart
 */
export interface FlexpartRetrieveSimple {
  area: GeoRectangle;
  end: string;

  /**
   * units: [°]
   */
  gridres: number;
  start: string;

  /**
   * units: [s]
   */
  timeStep: number;
}
