import { FlexpartCommandSimple, FlexpartOutgridSimple, FlexpartReleaseSimple } from "src/app/core/api/models"

export interface AppForms {
  flexpartRunSimple: {
    releases: FlexpartReleaseSimple[]
    command: FlexpartCommandSimple
    outgrid: FlexpartOutgridSimple
  }
}
