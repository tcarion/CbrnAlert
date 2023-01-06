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

import { Atp45DecisionTree } from '../models/atp-45-decision-tree';
import { Atp45Input } from '../models/atp-45-input';
import { Atp45Result } from '../models/atp-45-result';
import { Atp45RunTypes } from '../models/atp-45-run-types';
import { CbrnContainer } from '../models/cbrn-container';
import { ForecastAtp45Input } from '../models/forecast-atp-45-input';
import { ForecastAvailableSteps } from '../models/forecast-available-steps';
import { IncidentType } from '../models/incident-type';
import { ProcedureType } from '../models/procedure-type';
import { WindAtp45Input } from '../models/wind-atp-45-input';

@Injectable({
  providedIn: 'root',
})
export class Atp45ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation atp45TreeGet
   */
  static readonly Atp45TreeGetPath = '/atp45/tree';

  /**
   * Get the decision tree discriminating between the ATP-45 cases.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45TreeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45TreeGet$Response(params?: {
  }): Observable<StrictHttpResponse<Atp45DecisionTree>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45TreeGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Atp45DecisionTree>;
      })
    );
  }

  /**
   * Get the decision tree discriminating between the ATP-45 cases.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45TreeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45TreeGet(params?: {
  }): Observable<Atp45DecisionTree> {

    return this.atp45TreeGet$Response(params).pipe(
      map((r: StrictHttpResponse<Atp45DecisionTree>) => r.body as Atp45DecisionTree)
    );
  }

  /**
   * Path part for operation atp45RunPost
   */
  static readonly Atp45RunPostPath = '/atp45/run';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45RunPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunPost$Response(params: {

    /**
     * Determine if the weather conditions are retrieved in archive forecasts (&#x60;archive&#x60;), in latest forecast (&#x60;forecast&#x60;) or are provided in the request (&#x60;manually&#x60;)
     */
    weathertype: Atp45RunTypes;
    body: Atp45Input
  }): Observable<StrictHttpResponse<Atp45Result>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45RunPostPath, 'post');
    if (params) {
      rb.query('weathertype', params.weathertype, {"style":"form","explode":true});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45RunPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunPost(params: {

    /**
     * Determine if the weather conditions are retrieved in archive forecasts (&#x60;archive&#x60;), in latest forecast (&#x60;forecast&#x60;) or are provided in the request (&#x60;manually&#x60;)
     */
    weathertype: Atp45RunTypes;
    body: Atp45Input
  }): Observable<Atp45Result> {

    return this.atp45RunPost$Response(params).pipe(
      map((r: StrictHttpResponse<Atp45Result>) => r.body as Atp45Result)
    );
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

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45RunForecastPostPath, 'post');
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
  }): Observable<StrictHttpResponse<Atp45Result>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45RunWindPostPath, 'post');
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
   * Run ATP45 with request wind data
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45RunWindPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunWindPost(params: {
    body: WindAtp45Input
  }): Observable<Atp45Result> {

    return this.atp45RunWindPost$Response(params).pipe(
      map((r: StrictHttpResponse<Atp45Result>) => r.body as Atp45Result)
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

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.ForecastAvailableGetPath, 'get');
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
   * Path part for operation atp45ContainersGet
   */
  static readonly Atp45ContainersGetPath = '/atp45/containers';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45ContainersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45ContainersGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<CbrnContainer>>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45ContainersGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CbrnContainer>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45ContainersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45ContainersGet(params?: {
  }): Observable<Array<CbrnContainer>> {

    return this.atp45ContainersGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CbrnContainer>>) => r.body as Array<CbrnContainer>)
    );
  }

  /**
   * Path part for operation atp45ProceduresGet
   */
  static readonly Atp45ProceduresGetPath = '/atp45/procedures';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45ProceduresGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45ProceduresGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<ProcedureType>>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45ProceduresGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ProcedureType>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45ProceduresGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45ProceduresGet(params?: {
  }): Observable<Array<ProcedureType>> {

    return this.atp45ProceduresGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ProcedureType>>) => r.body as Array<ProcedureType>)
    );
  }

  /**
   * Path part for operation atp45IncidentsGet
   */
  static readonly Atp45IncidentsGetPath = '/atp45/incidents';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `atp45IncidentsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45IncidentsGet$Response(params?: {
  }): Observable<StrictHttpResponse<Array<IncidentType>>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45IncidentsGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<IncidentType>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `atp45IncidentsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45IncidentsGet(params?: {
  }): Observable<Array<IncidentType>> {

    return this.atp45IncidentsGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<IncidentType>>) => r.body as Array<IncidentType>)
    );
  }

}
