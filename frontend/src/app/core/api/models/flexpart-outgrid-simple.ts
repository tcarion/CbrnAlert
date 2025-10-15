/* tslint:disable */
/* eslint-disable */
import { GeoRectangle } from './geo-rectangle';
export interface FlexpartOutgridSimple {
  area: GeoRectangle;

  /**
   * unit: [°]
   */
  gridres: number;
  heights: Array<number>;
}
