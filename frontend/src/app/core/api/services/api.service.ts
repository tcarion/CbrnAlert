/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Atp45Result } from '../models/atp-45-result';
import { CbrnTypes } from '../models/cbrn-types';
import { FlexpartOutput } from '../models/flexpart-output';
import { FlexpartRun } from '../models/flexpart-run';
import { ForecastAtp45Input } from '../models/forecast-atp-45-input';
import { ForecastAvailableSteps } from '../models/forecast-available-steps';
import { WindAtp45Input } from '../models/wind-atp-45-input';
import { InlineResponse200 } from '../models/inline-response-200';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation atp45RunForecastPost
   */
  static readonly Atp45RunForecastPostPath = '/atp45/run/forecast';

  /**
   * Run ATP45 with forecast wind data
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45RunForecastPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunForecastPost$Response(params: {
    body: ForecastAtp45Input
  }): Observable<StrictHttpResponse<Atp45Result>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.Atp45RunForecastPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Atp45Result>;
      })
    );
  }

  /**
   * Run ATP45 with forecast wind data
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45RunForecastPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunForecastPost(params: {
    body: ForecastAtp45Input
  }): Observable<Atp45Result> {

    return this.atp45RunForecastPost$Response(params).pipe(
      map((r: StrictHttpResponse<Atp45Result>) => r.body as Atp45Result)
    );
  }

  /**
   * Path part for operation atp45RunWindPost
   */
  static readonly Atp45RunWindPostPath = '/atp45/run/wind';

  /**
   * Run ATP45 with request wind data
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45RunWindPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunWindPost$Response(params: {
    body: WindAtp45Input
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.Atp45RunWindPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Run ATP45 with request wind data
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45RunWindPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunWindPost(params: {
    body: WindAtp45Input
  }): Observable<void> {

    return this.atp45RunWindPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation forecastAvailableGet
   */
  static readonly ForecastAvailableGetPath = '/forecast/available';

  /**
   * Return the last forecast datetimes available at ECMWF
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `forecastAvailableGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  forecastAvailableGet$Response(params?: {
  }): Observable<StrictHttpResponse<ForecastAvailableSteps>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ForecastAvailableGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ForecastAvailableSteps>;
      })
    );
  }

  /**
   * Return the last forecast datetimes available at ECMWF
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `forecastAvailableGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  forecastAvailableGet(params?: {
  }): Observable<ForecastAvailableSteps> {

    return this.forecastAvailableGet$Response(params).pipe(
      map((r: StrictHttpResponse<ForecastAvailableSteps>) => r.body as ForecastAvailableSteps)
    );
  }

  /**
   * Path part for operation flexpartRunsGet
   */
  static readonly FlexpartRunsGetPath = '/flexpart/runs';

  /**
   * Return all the finished Flexpart runs
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<FlexpartRun>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartRunsGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FlexpartRun>>;
      })
    );
  }

  /**
   * Return all the finished Flexpart runs
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsGet(params?: {
  }): Observable<Array<FlexpartRun>> {

    return this.flexpartRunsGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<FlexpartRun>>) => r.body as Array<FlexpartRun>)
    );
  }

  /**
   * Path part for operation flexpartRunsRunIdGet
   */
  static readonly FlexpartRunsRunIdGetPath = '/flexpart/runs/{runId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsRunIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdGet$Response(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  }): Observable<StrictHttpResponse<FlexpartRun>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartRunsRunIdGetPath, 'get');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartRun>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdGet(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  }): Observable<FlexpartRun> {

    return this.flexpartRunsRunIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<FlexpartRun>) => r.body as FlexpartRun)
    );
  }

  /**
   * Path part for operation flexpartRunsRunIdOutputsGet
   */
  static readonly FlexpartRunsRunIdOutputsGetPath = '/flexpart/runs/{runId}/outputs';

  /**
   * Return the outputs of the Flexpart run `runId`
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsRunIdOutputsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdOutputsGet$Response(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  }): Observable<StrictHttpResponse<Array<FlexpartOutput>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartRunsRunIdOutputsGetPath, 'get');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FlexpartOutput>>;
      })
    );
  }

  /**
   * Return the outputs of the Flexpart run `runId`
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdOutputsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdOutputsGet(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  }): Observable<Array<FlexpartOutput>> {

    return this.flexpartRunsRunIdOutputsGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<FlexpartOutput>>) => r.body as Array<FlexpartOutput>)
    );
  }

  /**
   * Path part for operation flexpartRunsRunIdOutputsOutputIdGet
   */
  static readonly FlexpartRunsRunIdOutputsOutputIdGetPath = '/flexpart/runs/{runId}/outputs/{outputId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsRunIdOutputsOutputIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdOutputsOutputIdGet$Response(params: {

    /**
     * The flexpart run ID
     */
    runId: string;

    /**
     * The output ID
     */
    outputId: string;
  }): Observable<StrictHttpResponse<FlexpartOutput>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartRunsRunIdOutputsOutputIdGetPath, 'get');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartOutput>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdOutputsOutputIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdOutputsOutputIdGet(params: {

    /**
     * The flexpart run ID
     */
    runId: string;

    /**
     * The output ID
     */
    outputId: string;
  }): Observable<FlexpartOutput> {

    return this.flexpartRunsRunIdOutputsOutputIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<FlexpartOutput>) => r.body as FlexpartOutput)
    );
  }

  /**
   * Path part for operation flexpartOutputsOutputIdLayersGet
   */
  static readonly FlexpartOutputsOutputIdLayersGetPath = '/flexpart/outputs/{outputId}/layers';

  /**
   * Return the layers of the Flexpart output `outputId`
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartOutputsOutputIdLayersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartOutputsOutputIdLayersGet$Response(params: {

    /**
     * The output ID
     */
    outputId: string;

    /**
     * If only spatial layers must be retrieved
     */
    spatial?: boolean;
  }): Observable<StrictHttpResponse<Array<string>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartOutputsOutputIdLayersGetPath, 'get');
    if (params) {
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.query('spatial', params.spatial, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<string>>;
      })
    );
  }

  /**
   * Return the layers of the Flexpart output `outputId`
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdLayersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartOutputsOutputIdLayersGet(params: {

    /**
     * The output ID
     */
    outputId: string;

    /**
     * If only spatial layers must be retrieved
     */
    spatial?: boolean;
  }): Observable<Array<string>> {

    return this.flexpartOutputsOutputIdLayersGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<string>>) => r.body as Array<string>)
    );
  }

  /**
   * Path part for operation flexpartOutputsOutputIdDimensionsGet
   */
  static readonly FlexpartOutputsOutputIdDimensionsGetPath = '/flexpart/outputs/{outputId}/dimensions';

  /**
   * Return the dimensions layers of the Flexpart output `outputId` with their values
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartOutputsOutputIdDimensionsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartOutputsOutputIdDimensionsGet$Response(params: {

    /**
     * The output ID
     */
    outputId: string;

    /**
     * If the name of the layer is given, only returns the dimensions of the layer
     */
    layer?: string;

    /**
     * If false, don&#x27;t return the horizontal dimensions (lons and lats)
     */
    horizontal?: boolean;
  }): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartOutputsOutputIdDimensionsGetPath, 'get');
    if (params) {
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.query('layer', params.layer, {"style":"form","explode":true});
      rb.query('horizontal', params.horizontal, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * Return the dimensions layers of the Flexpart output `outputId` with their values
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdDimensionsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartOutputsOutputIdDimensionsGet(params: {

    /**
     * The output ID
     */
    outputId: string;

    /**
     * If the name of the layer is given, only returns the dimensions of the layer
     */
    layer?: string;

    /**
     * If false, don&#x27;t return the horizontal dimensions (lons and lats)
     */
    horizontal?: boolean;
  }): Observable<{
}> {

    return this.flexpartOutputsOutputIdDimensionsGet$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation flexpartOutputsOutputIdSlicePost
   */
  static readonly FlexpartOutputsOutputIdSlicePostPath = '/flexpart/outputs/{outputId}/slice';

  /**
   * Return a slice of the `output` according to some dimensions.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartOutputsOutputIdSlicePost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdSlicePost$Response(params: {

    /**
     * Name of the layer to slice
     */
    layer: string;

    /**
     * If true, the output is given in geojson format. The sliced layer must be a surface.
     */
    geojson?: boolean;

    /**
     * If true, data for legend is provided
     */
    legend?: boolean;

    /**
     * The output ID
     */
    outputId: string;

    /**
     * dimensions to be sliced along
     */
    body: {
}
  }): Observable<StrictHttpResponse<InlineResponse200>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FlexpartOutputsOutputIdSlicePostPath, 'post');
    if (params) {
      rb.query('layer', params.layer, {"style":"form","explode":true});
      rb.query('geojson', params.geojson, {"style":"form","explode":true});
      rb.query('legend', params.legend, {"style":"form","explode":true});
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InlineResponse200>;
      })
    );
  }

  /**
   * Return a slice of the `output` according to some dimensions.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdSlicePost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdSlicePost(params: {

    /**
     * Name of the layer to slice
     */
    layer: string;

    /**
     * If true, the output is given in geojson format. The sliced layer must be a surface.
     */
    geojson?: boolean;

    /**
     * If true, data for legend is provided
     */
    legend?: boolean;

    /**
     * The output ID
     */
    outputId: string;

    /**
     * dimensions to be sliced along
     */
    body: {
}
  }): Observable<InlineResponse200> {

    return this.flexpartOutputsOutputIdSlicePost$Response(params).pipe(
      map((r: StrictHttpResponse<InlineResponse200>) => r.body as InlineResponse200)
    );
  }

  /**
   * Path part for operation atp45CbrntypesGet
   */
  static readonly Atp45CbrntypesGetPath = '/atp45/cbrntypes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45CbrntypesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45CbrntypesGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<CbrnTypes>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.Atp45CbrntypesGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CbrnTypes>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45CbrntypesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45CbrntypesGet(params?: {
  }): Observable<Array<CbrnTypes>> {

    return this.atp45CbrntypesGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CbrnTypes>>) => r.body as Array<CbrnTypes>)
    );
  }

}
