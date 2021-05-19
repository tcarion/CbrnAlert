import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlexpartRequestService {

  constructor(
      private http: HttpClient
  ) { }

  retrieveMetData(metDataInput: any) {
    return this.http.post('http://127.0.0.1:8000/flexpart/metdata_retrieval', metDataInput);
}
}
