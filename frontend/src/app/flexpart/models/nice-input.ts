import { MapArea } from "src/app/core/models/map-area";

export interface NiceInput {
  start: Date,
  end: Date,
  area: MapArea,
  timeStep: number
}
