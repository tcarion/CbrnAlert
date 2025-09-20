/* tslint:disable */
/* eslint-disable */
import { GeoPoint } from './geo-point';
export interface FlexpartReleaseSimple {

  /**
   * unit: [m]
   */
  boxHeight?: number;

  /**
   * unit: [m]
   */
  boxLength?: number;

  /**
   * unit: [m]
   */
  boxWidth?: number;
  end: string;
  geometryName?: string;

  /**
   * unit: [m]
   */
  height: number;
  location: GeoPoint;

  /**
   * unit: [kg]
   */
  mass: number;
  particles?: number;
  start: string;
  substanceName: string;
}
