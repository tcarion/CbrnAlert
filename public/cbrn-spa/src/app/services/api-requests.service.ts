import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Payload {
    request: string
}

@Injectable({
  providedIn: 'root'
})
export class ApiRequestsService {

    constructor(private http: HttpClient) { }

    atp45Request(payload: Payload) {
        return this.http.post('http://127.0.0.1:8000/atp45', payload);
    }

    flexpartRequest(payload: Payload) {
        return this.http.post('http://127.0.0.1:8000/flexpart', payload);
    }
}
