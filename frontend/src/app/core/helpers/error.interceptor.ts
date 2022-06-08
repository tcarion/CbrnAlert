import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).
        pipe(
          catchError( (error: HttpErrorResponse) => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
              alert('this is client side error');
              errorMsg = `Error: ${error.error.message}`;
            }
            else {
              errorMsg = `Error Code: ${error.status},  Message: ${error.error}`;
              alert(`this is server side error.\n${errorMsg}`);
            }
            console.log(errorMsg);
            return throwError(errorMsg);
          })
        )
    }
}
