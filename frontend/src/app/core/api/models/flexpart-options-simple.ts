/* tslint:disable */
/* eslint-disable */
import { FlexpartCommandSimple } from './flexpart-command-simple';
import { FlexpartOutgridSimple } from './flexpart-outgrid-simple';
import { FlexpartReleaseSimple } from './flexpart-release-simple';
export interface FlexpartOptionsSimple {
  command: FlexpartCommandSimple;
  outgrid: FlexpartOutgridSimple;
  releases: Array<FlexpartReleaseSimple>;
}
