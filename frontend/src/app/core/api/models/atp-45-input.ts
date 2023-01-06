/* tslint:disable */
/* eslint-disable */
import { Atp45Categories } from './atp-45-categories';
import { Atp45Weather } from './atp-45-weather';
import { GeoPoint } from './geo-point';

/**
 * Information needed to run ATP45. It requires at least the list of id's for discriminating the decision tree and some release location(s).
 */
export interface Atp45Input {
  categories: Atp45Categories;
  locations: Array<GeoPoint>;
  weather?: Atp45Weather;
}
