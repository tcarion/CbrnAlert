import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

@Injectable()
export class HandleDateInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
        return next.handle(request)
        // .pipe(
        //     map((event) => {
        //         if (event instanceof HttpResponse) {
        //             let data = event.body;
        //             if (!Array.isArray(data)) {
        //                 this.objToDate(data);
        //             } else {
        //                 data.forEach((obj) => {
        //                     this.objToDate(obj)
        //                 })
        //             }

        //             // console.log(data);
        //             return event.clone({ body: data });
        //         } else {
        //             return event;
        //         }
        //     })
        //   );
    }

    objToDate(obj: any) {
        const re = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

        for (const property in obj) {
            const value = obj[property];
            if (typeof value == 'string' && value.match(re) ) {
                const found = value.match(re)![0];
                obj[property] = dayjs(found, 'YYYY-MM-DDTHH:mm:ss').toDate();
            }
        }      
    }

}
