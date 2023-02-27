/* tslint:disable */
/* eslint-disable */

/**
 * Application specific error code when a retrieval to MARS from ECMWF fails.
 * Possible values area:
 * - 'dataNotYetAvailable': The requested weather data are not available yet.
 * - 'unknownMarsError': MARS error that couldn't be identified.
 */
export enum WeatherRetrievalErrorCode {
  DataNotYetAvailable = 'dataNotYetAvailable',
  UnknownMarsError = 'unknownMarsError'
}
