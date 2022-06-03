/* tslint:disable */
/* eslint-disable */
import { GeoRectangle } from './geo-rectangle';
export interface FlexpartOutgridSimple {
  area: GeoRectangle;

  /**
   * units: [°]
   */
  gridres: number;
  heights: Array<number>;
}
