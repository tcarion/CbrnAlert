/* tslint:disable */
/* eslint-disable */

/**
 * Application specific error code when a Flexpart run fails.
 * Possible values area:
 * - 'noMeteoFieldsAvailable': The Flexpart run time window exceeds the available meteorological fields valid time.
 * - 'unknownFlexpartRunError': Flexpart run error that couldn't be identified.
 */
export enum FlexpartRunErrorCode {
  NoMeteoFieldsAvailable = 'noMeteoFieldsAvailable',
  UnknownFlexpartRunError = 'unknownFlexpartRunError'
}
