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
import { ForecastAtp45Input } from '../models/forecast-atp-45-input';
import { ForecastAvailableSteps } from '../models/forecast-available-steps';
import { WindAtp45Input } from '../models/wind-atp-45-input';

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

}
