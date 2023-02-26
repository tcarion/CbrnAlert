import { UnauthorizedError } from 'src/app/core/api/models/unauthorized-error';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';


// ? nice example to handle errors: https://github.com/cyclosproject/cyclos4-ui/blob/65ee1600b624de09fe093d25c44b9c3a6b09522c/src/app/core/error-handler.service.ts

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleHttpError(err: HttpErrorResponse) {
    let errorMsg = '';
    if (err.error instanceof ErrorEvent) {
      errorMsg = `Error: ${err.error.message}`;
      alert('this is client side error');
    } else {
      let error = err.error;
      // error.error = error.error as JsonErrorBody
      // alert(`this is server side error.\n${errorMsg}`);
      switch(err.status) {
        case 401:
          console.error("Unauthorized", error)
      }
    }

    return;
  }
}
