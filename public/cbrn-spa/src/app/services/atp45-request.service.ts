import { GribData } from './../interfaces/atp45/grib-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Atp45RequestService {

    constructor(private http: HttpClient) { }

    getAvailableSteps(gribData: GribData) {
        return this.http.post('http://127.0.0.1:8000/atp45/available_steps', gribData);
    }

    getAvailableGribFiles() {
        return this.http.get('http://127.0.0.1:8000/atp45/available_gribfiles');
    }

    getAtp45Prediction(atp45Input: any) {
        return this.http.post('http://127.0.0.1:8000/atp45/prediction_request', atp45Input);
    }

    getAtp45RealtimePrediction(atp45Input: any) {
        return this.http.post('http://127.0.0.1:8000/atp45/realtime_prediction_request', atp45Input);
    }

    archiveRetrieval(archiveInput: any) {
        return this.http.post('http://127.0.0.1:8000/atp45/archive_retrieval', archiveInput);
    }

    getRealtimeAvailableSteps() {
        return this.http.get('http://127.0.0.1:8000/atp45/realtime_available_steps');
    }
}
