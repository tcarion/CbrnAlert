import { User } from 'src/app/core/api/models';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap, mapTo, shareReplay } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';
import { AuthApiService } from '../api/services';

interface LoginRespone {
    idToken: string,
    expiresIn: number,
    user: User
}
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    isAuth = true;

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser$: Observable<User>;

    constructor(
        private http: HttpClient,
        private router: Router,
        private authApiService: AuthApiService
    ) {
        const user = localStorage.getItem('currentUser') || '{}';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user));
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
      let loginBody = {
        email,
        password
      }
      return this.authApiService.loginPost({body: loginBody})
        .pipe(
            tap((res) => {
              this.currentUserSubject.next(res.user)
              this.setSession(res.idToken, res.user, res.expiresIn);
          }),
        shareReplay()
        )

    }
    private setSession(idToken: string, user: User, expiresIn: number | undefined = undefined) {
      const expiresAt = expiresIn !== undefined && dayjs().add(expiresIn, 'second');
      localStorage.setItem('id_token', idToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('expires_at');
        this.router.navigateByUrl('/').then(() => {
            window.location.reload();
        });
    }

    public isLoggedIn() {
        return dayjs().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        if (expiration !== null) {
            const expiresAt = JSON.parse(expiration);
            return dayjs(expiresAt);
        } else {
            return 0;
        }
    }
}
