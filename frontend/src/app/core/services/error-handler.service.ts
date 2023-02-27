import { UnauthorizedError } from 'src/app/core/api/models/unauthorized-error';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FlexpartRunErrorCode } from 'src/app/core/api/models';


// ? nice example to handle errors: https://github.com/cyclosproject/cyclos4-ui/blob/65ee1600b624de09fe093d25c44b9c3a6b09522c/src/app/core/error-handler.service.ts

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private notification: NotificationService
  ) { }

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
          console.error("Unauthorized", error);
          break
        case 500:
          if (error != null && error.hasOwnProperty('code')) {
            let snack_options = {timeout: 10000, status: 'error'}
            switch (error.code) {
              case FlexpartRunErrorCode.NoMeteoFieldsAvailable:
                this.notification.snackBar('The Flexpart run time window exceeds the available meteorological fields valid time. Try to reduce the simulation duration in COMMAND options.', {timeout: 10000, status: 'error'})
                break
              case FlexpartRunErrorCode.UnknownFlexpartRunError:
                this.notification.snackBar('The Flexpart run has failed for an unknown reason.', {timeout: 10000, status: 'error'});
                break
            }
            this.notification.snackBar('An unkown server error occured.', {timeout: 3000, status: 'error'});
          }
          break

        case 0:
          this.notification.snackBar('An unexpected server error occured. Please contact the web admin to report it.', {timeout: 10000, status: 'error'});
          break
      }
      this.notification.snackBar(`An unknown error has occured with status ${err.status}.`, {timeout: 10000, status: 'error'});
    }

    return;
  }
}
