/* tslint:disable */
/* eslint-disable */
import { Atp45InputWeatherInputOneOf } from './atp-45-input-weather-input-one-of';
import { Atp45WeatherManual } from './atp-45-weather-manual';
import { ForecastStep } from './forecast-step';
export type Atp45InputWeatherInput = (Atp45WeatherManual | ForecastStep | Atp45InputWeatherInputOneOf);
