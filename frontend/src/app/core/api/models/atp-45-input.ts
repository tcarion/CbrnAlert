/* tslint:disable */
/* eslint-disable */
import { Atp45InputWeatherInput } from './atp-45-input-weather-input';
import { GeoPoint } from './geo-point';

/**
 * Information needed to run ATP45. It requires at least the list of id's for discriminating the decision tree and some release location(s).
 */
export interface Atp45Input {

  /**
   * Array of ids, identifying the categories.
   */
  categories: Array<string>;
  locations: Array<GeoPoint>;
  weatherInput: Atp45InputWeatherInput;
}
