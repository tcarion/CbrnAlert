import { FormControl, FormGroup } from "@angular/forms"

// export interface Atp45RunForm{
//   locations: Loca
// }

export interface MeteoForm {
  wind?: FormGroup<WindForm>,
  stability?: FormControl<Atp45StabilityClasses>
}

export enum Atp45StabilityClasses {
  UNSTABLE = 'unstable',
  NEUTRAL = 'neutral',
  STABLE = 'stable',
}

export interface WindForm {
  speed: FormControl<number>,
  azimuth: FormControl<number>
}
