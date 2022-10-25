/* tslint:disable */
/* eslint-disable */
import { CbrnContainer } from './cbrn-container';
import { IncidentType } from './incident-type';
import { ProcedureType } from './procedure-type';
export interface CbrnType {
  container?: CbrnContainer;
  incident?: IncidentType;
  procedureType: ProcedureType;
}
