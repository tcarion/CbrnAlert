import { FlexpartCommandSimple, FlexpartOutgridSimple, FlexpartReleaseSimple } from "src/app/core/api/v1"

export interface AppForms {
  flexpartRunSimple: {
    releases: FlexpartReleaseSimple[]
    command: FlexpartCommandSimple
    outgrid: FlexpartOutgridSimple
  }
}
