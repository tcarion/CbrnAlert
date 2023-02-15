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

import { Atp45DecisionTree } from '../models/atp-45-decision-tree';
import { Atp45Input } from '../models/atp-45-input';
import { Atp45Result } from '../models/atp-45-result';
import { Atp45RunTypes } from '../models/atp-45-run-types';
import { ForecastAvailableSteps } from '../models/forecast-available-steps';

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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Atp45DecisionTree>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45TreeGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `atp45TreeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  atp45TreeGet(params?: {
  },
  context?: HttpContext

): Observable<Atp45DecisionTree> {

    return this.atp45TreeGet$Response(params,context).pipe(
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
     * Determine if the weather conditions are retrieved in archive forecasts (`archive`), in latest forecast (`forecast`) or are provided in the request (`manually`)
     */
    weathertype: Atp45RunTypes;
    body: Atp45Input
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Atp45Result>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.Atp45RunPostPath, 'post');
    if (params) {
      rb.query('weathertype', params.weathertype, {"style":"form","explode":true});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Atp45Result>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `atp45RunPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  atp45RunPost(params: {

    /**
     * Determine if the weather conditions are retrieved in archive forecasts (`archive`), in latest forecast (`forecast`) or are provided in the request (`manually`)
     */
    weathertype: Atp45RunTypes;
    body: Atp45Input
  },
  context?: HttpContext

): Observable<Atp45Result> {

    return this.atp45RunPost$Response(params,context).pipe(
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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ForecastAvailableSteps>> {

    const rb = new RequestBuilder(this.rootUrl, Atp45ApiService.ForecastAvailableGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `forecastAvailableGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  forecastAvailableGet(params?: {
  },
  context?: HttpContext

): Observable<ForecastAvailableSteps> {

    return this.forecastAvailableGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ForecastAvailableSteps>) => r.body as ForecastAvailableSteps)
    );
  }

}
