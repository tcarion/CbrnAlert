/* tslint:disable */
/* eslint-disable */
import { Atp45WeatherStability } from './atp-45-weather-stability';
import { WindVelocity } from './wind-velocity';

/**
 * Weather conditions description for ATP45, in case it is provided by the user.
 */
export interface Atp45Weather {
  stability?: Atp45WeatherStability;
  wind?: WindVelocity;
}
