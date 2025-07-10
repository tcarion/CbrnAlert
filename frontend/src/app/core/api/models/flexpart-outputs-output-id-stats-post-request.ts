/* tslint:disable */
/* eslint-disable */
export interface FlexpartOutputsOutputIdStatsPostRequest {

  /**
   * Indices of selected dimensions (time and height)
   */
  dims: {
[key: string]: number;
};

  /**
   * Threshold value used to calculate stats (ensemble agreement and individual masks)
   */
  threshold: number;
}
