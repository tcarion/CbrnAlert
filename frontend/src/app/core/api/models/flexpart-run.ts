/* tslint:disable */
/* eslint-disable */
import { RunStatus } from './run-status';
export interface FlexpartRun {
  date_created: string;
  name: string;
  options: {
};
  status?: RunStatus;
  uuid: string;
}
