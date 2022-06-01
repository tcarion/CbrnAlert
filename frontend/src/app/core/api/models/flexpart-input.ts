/* tslint:disable */
/* eslint-disable */
import { RunStatus } from './run-status';
export interface FlexpartInput {
  control: {
[key: string]: string;
};
  date_created: string;
  name: string;
  status?: RunStatus;
  uuid: string;
}
