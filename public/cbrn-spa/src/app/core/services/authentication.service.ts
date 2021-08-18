import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap, mapTo, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';

import * as dayjs from 'dayjs';

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
        private router: Router
    ) { 
        const user = localStorage.getItem('currentUser') || '{}';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user));
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http
            .post<LoginRespone>('http://127.0.0.1:8000/login', {
                email,
                password,
            })
            .pipe(
                tap((res) => {
                    this.currentUserSubject.next(res.user)
                    this.setSession(res);
                }),
                shareReplay()
            );
        // this is just the HTTP call,
        // we still need to handle the reception of the token;
    }

    private setSession(authResult: LoginRespone) {
        const expiresAt = dayjs().add(authResult.expiresIn, 'second');
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('currentUser', JSON.stringify(authResult.user));
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
