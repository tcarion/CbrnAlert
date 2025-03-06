/* tslint:disable */
/* eslint-disable */
export interface FlexpartCommandSimple {
  end: string;

  /**
   * Unit for the output type (see Flexpart docs)
   */
  outputType: number;
  start: string;

  /**
   * unit: [s]
   */
  timeStep: number;
}
