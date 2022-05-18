/* tslint:disable */
/* eslint-disable */
import { BasicAtp45Input } from './basic-atp-45-input';
import { ForecastStep } from './forecast-step';
export type ForecastAtp45Input = BasicAtp45Input & {

/**
 * Step of the forecast
 */
'step'?: ForecastStep;
};
