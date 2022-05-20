import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // let currentUser = this.authenticationService.isAuth;
        // if (currentUser && currentUser.token) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${currentUser.token}`
        //         }
        //     });
        // }

        const idToken = localStorage.getItem("id_token");
        console.log(req)
        if (idToken) {
            const cloned = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${idToken}`
                        }
                    });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}