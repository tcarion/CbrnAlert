/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { FlexpartInput } from '../models/flexpart-input';
import { FlexpartOutput } from '../models/flexpart-output';
import { FlexpartRun } from '../models/flexpart-run';
import { RunStatus } from '../models/run-status';
import { FlexpartInputPostRequest } from '../models/flexpart-input-post-request';
import { FlexpartOutputsOutputIdSlicePost200Response } from '../models/flexpart-outputs-output-id-slice-post-200-response';
import { FlexpartOutputsOutputIdStatsPostRequest } from '../models/flexpart-outputs-output-id-stats-post-request';
import { FlexpartRunPostRequest } from '../models/flexpart-run-post-request';

@Injectable({
  providedIn: 'root',
})
export class FlexpartApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation flexpartInputPost
   */
  static readonly FlexpartInputPostPath = '/flexpart/input';

  /**
   * Retrieve the meteorological data needed for flexpart
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartInputPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartInputPost$Response(params: {

    /**
     * If `simple`, use the simplified options structure defined by `FlexpartRetrieveSimple`. If `detailed`, a full Flexpart options object is expected (see Flexpart docs)
     */
    retrievalType?: 'simple' | 'detailed';
    body: FlexpartInputPostRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartInput>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartInputPostPath, 'post');
    if (params) {
      rb.query('retrievalType', params.retrievalType, {"style":"form","explode":true});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartInput>;
      })
    );
  }

  /**
   * Retrieve the meteorological data needed for flexpart
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartInputPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartInputPost(params: {

    /**
     * If `simple`, use the simplified options structure defined by `FlexpartRetrieveSimple`. If `detailed`, a full Flexpart options object is expected (see Flexpart docs)
     */
    retrievalType?: 'simple' | 'detailed';
    body: FlexpartInputPostRequest
  },
  context?: HttpContext

): Observable<FlexpartInput> {

    return this.flexpartInputPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartInput>) => r.body as FlexpartInput)
    );
  }

  /**
   * Path part for operation flexpartInputsGet
   */
  static readonly FlexpartInputsGetPath = '/flexpart/inputs';

  /**
   * Return all the Flexpart inputs available (default finished)
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartInputsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsGet$Response(params?: {
    status?: RunStatus;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<FlexpartInput>>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartInputsGetPath, 'get');
    if (params) {
      rb.query('status', params.status, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FlexpartInput>>;
      })
    );
  }

  /**
   * Return all the Flexpart inputs available (default finished)
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartInputsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsGet(params?: {
    status?: RunStatus;
  },
  context?: HttpContext

): Observable<Array<FlexpartInput>> {

    return this.flexpartInputsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<FlexpartInput>>) => r.body as Array<FlexpartInput>)
    );
  }

  /**
   * Path part for operation flexpartInputsInputIdGet
   */
  static readonly FlexpartInputsInputIdGetPath = '/flexpart/inputs/{inputId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartInputsInputIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsInputIdGet$Response(params: {

    /**
     * The input ID
     */
    inputId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartInput>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartInputsInputIdGetPath, 'get');
    if (params) {
      rb.path('inputId', params.inputId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartInput>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartInputsInputIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsInputIdGet(params: {

    /**
     * The input ID
     */
    inputId: string;
  },
  context?: HttpContext

): Observable<FlexpartInput> {

    return this.flexpartInputsInputIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartInput>) => r.body as FlexpartInput)
    );
  }

  /**
   * Path part for operation flexpartInputsInputIdPut
   */
  static readonly FlexpartInputsInputIdPutPath = '/flexpart/inputs/{inputId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartInputsInputIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsInputIdPut$Response(params: {

    /**
     * The input ID
     */
    inputId: string;

    /**
     * The new file name chosen by the user
     */
    newName: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartInput>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartInputsInputIdPutPath, 'put');
    if (params) {
      rb.path('inputId', params.inputId, {"style":"simple","explode":false});
      rb.query('newName', params.newName, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartInput>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartInputsInputIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsInputIdPut(params: {

    /**
     * The input ID
     */
    inputId: string;

    /**
     * The new file name chosen by the user
     */
    newName: string;
  },
  context?: HttpContext

): Observable<FlexpartInput> {

    return this.flexpartInputsInputIdPut$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartInput>) => r.body as FlexpartInput)
    );
  }

  /**
   * Path part for operation flexpartInputsInputIdDelete
   */
  static readonly FlexpartInputsInputIdDeletePath = '/flexpart/inputs/{inputId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartInputsInputIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsInputIdDelete$Response(params: {

    /**
     * The input ID
     */
    inputId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartInput>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartInputsInputIdDeletePath, 'delete');
    if (params) {
      rb.path('inputId', params.inputId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartInput>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartInputsInputIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartInputsInputIdDelete(params: {

    /**
     * The input ID
     */
    inputId: string;
  },
  context?: HttpContext

): Observable<FlexpartInput> {

    return this.flexpartInputsInputIdDelete$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartInput>) => r.body as FlexpartInput)
    );
  }

  /**
   * Path part for operation flexpartRunPost
   */
  static readonly FlexpartRunPostPath = '/flexpart/run';

  /**
   * Run flexpart
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartRunPost$Response(params: {

    /**
     * If `simple`, use the simplified options structure defined by `FlexpartOptionsSimple`. If `detailed`, a full Flexpart options object is expected (see Flexpart docs)
     */
    runType?: 'simple' | 'detailed';

    /**
     * Input id
     */
    inputId: string;

    /**
     * Options for Flexpart.
     */
    body: FlexpartRunPostRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartRun>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartRunPostPath, 'post');
    if (params) {
      rb.query('runType', params.runType, {"style":"form","explode":true});
      rb.query('inputId', params.inputId, {"style":"form","explode":true});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartRun>;
      })
    );
  }

  /**
   * Run flexpart
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartRunPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartRunPost(params: {

    /**
     * If `simple`, use the simplified options structure defined by `FlexpartOptionsSimple`. If `detailed`, a full Flexpart options object is expected (see Flexpart docs)
     */
    runType?: 'simple' | 'detailed';

    /**
     * Input id
     */
    inputId: string;

    /**
     * Options for Flexpart.
     */
    body: FlexpartRunPostRequest
  },
  context?: HttpContext

): Observable<FlexpartRun> {

    return this.flexpartRunPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartRun>) => r.body as FlexpartRun)
    );
  }

  /**
   * Path part for operation flexpartRunsGet
   */
  static readonly FlexpartRunsGetPath = '/flexpart/runs';

  /**
   * Return all the Flexpart runs (default finished)
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsGet$Response(params?: {
    status?: RunStatus;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<FlexpartRun>>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartRunsGetPath, 'get');
    if (params) {
      rb.query('status', params.status, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FlexpartRun>>;
      })
    );
  }

  /**
   * Return all the Flexpart runs (default finished)
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsGet(params?: {
    status?: RunStatus;
  },
  context?: HttpContext

): Observable<Array<FlexpartRun>> {

    return this.flexpartRunsGet$Response(params,context).pipe(
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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartRun>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartRunsRunIdGetPath, 'get');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartRun>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdGet(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  },
  context?: HttpContext

): Observable<FlexpartRun> {

    return this.flexpartRunsRunIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartRun>) => r.body as FlexpartRun)
    );
  }

  /**
   * Path part for operation flexpartRunsRunIdPut
   */
  static readonly FlexpartRunsRunIdPutPath = '/flexpart/runs/{runId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsRunIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdPut$Response(params: {

    /**
     * The flexpart run ID
     */
    runId: string;

    /**
     * The new file name chosen by the user
     */
    newName: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartRun>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartRunsRunIdPutPath, 'put');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
      rb.query('newName', params.newName, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartRun>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdPut(params: {

    /**
     * The flexpart run ID
     */
    runId: string;

    /**
     * The new file name chosen by the user
     */
    newName: string;
  },
  context?: HttpContext

): Observable<FlexpartRun> {

    return this.flexpartRunsRunIdPut$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartRun>) => r.body as FlexpartRun)
    );
  }

  /**
   * Path part for operation flexpartRunsRunIdDelete
   */
  static readonly FlexpartRunsRunIdDeletePath = '/flexpart/runs/{runId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartRunsRunIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdDelete$Response(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartRun>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartRunsRunIdDeletePath, 'delete');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartRun>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdDelete(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  },
  context?: HttpContext

): Observable<FlexpartRun> {

    return this.flexpartRunsRunIdDelete$Response(params,context).pipe(
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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<FlexpartOutput>>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartRunsRunIdOutputsGetPath, 'get');
    if (params) {
      rb.path('runId', params.runId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartRunsRunIdOutputsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartRunsRunIdOutputsGet(params: {

    /**
     * The flexpart run ID
     */
    runId: string;
  },
  context?: HttpContext

): Observable<Array<FlexpartOutput>> {

    return this.flexpartRunsRunIdOutputsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<FlexpartOutput>>) => r.body as Array<FlexpartOutput>)
    );
  }

  /**
   * Path part for operation flexpartOutputsOutputIdGet
   */
  static readonly FlexpartOutputsOutputIdGetPath = '/flexpart/outputs/{outputId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartOutputsOutputIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartOutputsOutputIdGet$Response(params: {

    /**
     * The output ID
     */
    outputId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartOutput>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartOutputsOutputIdGetPath, 'get');
    if (params) {
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartOutput>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  flexpartOutputsOutputIdGet(params: {

    /**
     * The output ID
     */
    outputId: string;
  },
  context?: HttpContext

): Observable<FlexpartOutput> {

    return this.flexpartOutputsOutputIdGet$Response(params,context).pipe(
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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<string>>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartOutputsOutputIdLayersGetPath, 'get');
    if (params) {
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.query('spatial', params.spatial, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
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
  },
  context?: HttpContext

): Observable<Array<string>> {

    return this.flexpartOutputsOutputIdLayersGet$Response(params,context).pipe(
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
     * If false, don't return the horizontal dimensions (lons and lats)
     */
    horizontal?: boolean;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartOutputsOutputIdDimensionsGetPath, 'get');
    if (params) {
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.query('layer', params.layer, {"style":"form","explode":true});
      rb.query('horizontal', params.horizontal, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
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
     * If false, don't return the horizontal dimensions (lons and lats)
     */
    horizontal?: boolean;
  },
  context?: HttpContext

): Observable<{
}> {

    return this.flexpartOutputsOutputIdDimensionsGet$Response(params,context).pipe(
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
   * To access only the response body, use `flexpartOutputsOutputIdSlicePost$Json()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdSlicePost$Json$Response(params: {

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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<FlexpartOutputsOutputIdSlicePost200Response>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartOutputsOutputIdSlicePostPath, 'post');
    if (params) {
      rb.query('layer', params.layer, {"style":"form","explode":true});
      rb.query('geojson', params.geojson, {"style":"form","explode":true});
      rb.query('legend', params.legend, {"style":"form","explode":true});
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FlexpartOutputsOutputIdSlicePost200Response>;
      })
    );
  }

  /**
   * Return a slice of the `output` according to some dimensions.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdSlicePost$Json$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdSlicePost$Json(params: {

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
  },
  context?: HttpContext

): Observable<FlexpartOutputsOutputIdSlicePost200Response> {

    return this.flexpartOutputsOutputIdSlicePost$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<FlexpartOutputsOutputIdSlicePost200Response>) => r.body as FlexpartOutputsOutputIdSlicePost200Response)
    );
  }

  /**
   * Return a slice of the `output` according to some dimensions.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartOutputsOutputIdSlicePost$Tiff()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdSlicePost$Tiff$Response(params: {

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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartOutputsOutputIdSlicePostPath, 'post');
    if (params) {
      rb.query('layer', params.layer, {"style":"form","explode":true});
      rb.query('geojson', params.geojson, {"style":"form","explode":true});
      rb.query('legend', params.legend, {"style":"form","explode":true});
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'image/tiff',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * Return a slice of the `output` according to some dimensions.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdSlicePost$Tiff$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdSlicePost$Tiff(params: {

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
  },
  context?: HttpContext

): Observable<Blob> {

    return this.flexpartOutputsOutputIdSlicePost$Tiff$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation flexpartOutputsOutputIdStatsPost
   */
  static readonly FlexpartOutputsOutputIdStatsPostPath = '/flexpart/outputs/{outputId}/stats';

  /**
   * Return ensemble statistics of the plotted `output`, based on layer, dimensions and input threshold value.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `flexpartOutputsOutputIdStatsPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdStatsPost$Response(params: {

    /**
     * The output ID
     */
    outputId: string;

    /**
     * Name of the plotted layer
     */
    layer: string;
    body: FlexpartOutputsOutputIdStatsPostRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, FlexpartApiService.FlexpartOutputsOutputIdStatsPostPath, 'post');
    if (params) {
      rb.path('outputId', params.outputId, {"style":"simple","explode":false});
      rb.query('layer', params.layer, {"style":"form","explode":true});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'image/tiff',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * Return ensemble statistics of the plotted `output`, based on layer, dimensions and input threshold value.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `flexpartOutputsOutputIdStatsPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  flexpartOutputsOutputIdStatsPost(params: {

    /**
     * The output ID
     */
    outputId: string;

    /**
     * Name of the plotted layer
     */
    layer: string;
    body: FlexpartOutputsOutputIdStatsPostRequest
  },
  context?: HttpContext

): Observable<Blob> {

    return this.flexpartOutputsOutputIdStatsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

}
