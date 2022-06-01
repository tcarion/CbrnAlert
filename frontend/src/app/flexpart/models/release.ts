import { GeoPoint } from "src/app/core/api/models";

export interface Release {
  location: GeoPoint,
  start: Date,
  // step: Dayjs,
  end: Date,
  // nstep: number,
  height: number,
  mass: number
}
