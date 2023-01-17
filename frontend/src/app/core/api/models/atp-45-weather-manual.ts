/* tslint:disable */
/* eslint-disable */
import { Atp45WeatherManualStability } from './atp-45-weather-manual-stability';
import { WindVelocity } from './wind-velocity';

/**
 * Weather conditions description for ATP45, in case it is provided by the user.
 */
export interface Atp45WeatherManual {
  stability: Atp45WeatherManualStability;
  wind: WindVelocity;
}
