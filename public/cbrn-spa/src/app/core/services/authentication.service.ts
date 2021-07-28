import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap, mapTo, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';

import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuth = true;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<User>('http://127.0.0.1:8000/login', {
        email,
        password,
      })
      .pipe(
        tap((res) => this.setSession(res)),
        shareReplay()
      );
    // this is just the HTTP call,
    // we still need to handle the reception of the token;
  }

  private setSession(authResult: any) {
    const expiresAt = dayjs().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
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
