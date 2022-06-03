/* tslint:disable */
/* eslint-disable */
export interface FlexpartCommandSimple {
  end: string;

  /**
   * Units for the output (see Flexpart docs)
   */
  outputType: number;
  specie?: string;
  start: string;

  /**
   * units: [s]
   */
  timeStep: number;
}
