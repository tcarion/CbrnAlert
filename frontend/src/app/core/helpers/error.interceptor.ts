import { ErrorHandlerService } from './../services/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
      private authenticationService: AuthenticationService,
      private errorHandlerService: ErrorHandlerService
      ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).
        pipe(
          catchError( (error: HttpErrorResponse) => {
            this.errorHandlerService.handleHttpError(error);
            return throwError(() => error);
          })
        )
    }
}
