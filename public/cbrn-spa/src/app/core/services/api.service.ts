import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

interface Payload {
    request: string
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    private formatErrors(error: any) {
        return throwError(error.error);
      }

    // getChannel() {
    //     return this.http.get(environment.apiUrl + '/getchannel');
    // }

    atp45Request(payload: Payload) {
        return this.http.post(environment.apiUrl + '/atp45', payload);
    }

    flexpartRequest(payload: Payload) {
        return this.http.post(environment.apiUrl + '/flexpart', payload);
    }

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api${path}`, { params: {test : 'message'} })
          .pipe(catchError(this.formatErrors));
      }
}
