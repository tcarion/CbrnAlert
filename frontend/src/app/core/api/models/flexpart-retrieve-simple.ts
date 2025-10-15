/* tslint:disable */
/* eslint-disable */
import { GeoRectangle } from './geo-rectangle';

/**
 * Simplified data structure needed for a retrieval of meteorological data for Flexpart
 */
export interface FlexpartRetrieveSimple {
  area: GeoRectangle;

  /**
   * button to select either "deterministic" or "ensemble" data
   */
  datasetType: string;
  end: string;

  /**
   * unit: [°]
   */
  gridres: number;
  start: string;

  /**
   * unit: [s]
   */
  timeStep: number;
}
