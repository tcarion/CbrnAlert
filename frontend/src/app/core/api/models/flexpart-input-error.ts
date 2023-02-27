/* tslint:disable */
/* eslint-disable */
import { WeatherRetrievalErrorCode } from './weather-retrieval-error-code';
export interface FlexpartInputError {
  code?: WeatherRetrievalErrorCode;
  error?: string;
  info?: string;
}
