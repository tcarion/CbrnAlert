/* tslint:disable */
/* eslint-disable */
import { Atp45Categories } from './atp-45-categories';
import { Atp45WeatherManual } from './atp-45-weather-manual';
import { ForecastStep } from './forecast-step';
import { GeoPoint } from './geo-point';

/**
 * Information needed to run ATP45. It requires at least the list of id's for discriminating the decision tree and some release location(s).
 */
export interface Atp45Input {
  categories: Atp45Categories;
  locations: Array<GeoPoint>;
  weatherInput: (Atp45WeatherManual | ForecastStep | {
'archiveDate': string;
});
}
