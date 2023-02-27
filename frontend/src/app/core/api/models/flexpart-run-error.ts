/* tslint:disable */
/* eslint-disable */
import { FlexpartRunErrorCode } from './flexpart-run-error-code';

/**
 * Error when a Flexpart run fails.
 */
export interface FlexpartRunError {
  code?: FlexpartRunErrorCode;
  error?: string;
  info?: string;
}
