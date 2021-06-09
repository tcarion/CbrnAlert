import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { GribData } from './grib-data';
import { ShapeData } from './shape-data';

import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { MapService } from 'src/app/core/services/map.service';
import { Feature, FeatureCollection } from 'geojson';

@Injectable({
    providedIn: 'root',
})
export class Atp45Service {
    inputs: GribData[];
    results: ShapeData[] = [];

    inputsSubject = new Subject<GribData[]>();
    resultsSubject = new Subject<ShapeData>();

    constructor(
        private apiService: ApiService,
        private mapService: MapService) { }

    getInputs(): Observable<GribData[]> {
        return this.apiService
            .atp45Request({ request: 'available_gribfiles' })
            .pipe(
                map((data: any) => {
                    data.forEach((element: any) => {
                        element.startdate = new Date(element.startdate);
                    });
                    return <GribData[]>data;
                })
            );
    }

    getResult(payload: any, request: string): Observable<ShapeData> {
        payload = {
            ...payload,
            request: request
        }
        return this.apiService
            .atp45Request(payload)
            .pipe(
                map((data: any) => {
                    console.log(data)

                    return this.responseToShapeData(data);
                })
            );
    }

    responseToShapeData(shapeData: any): ShapeData {
        let shapes = <FeatureCollection>shapeData.shapes;
        shapeData.datetime = new Date(shapeData.datetime);
        let speed = Math.round(shapeData.wind.speed * 3.6 * 10) / 10;

        for (const feature of shapes.features) {
            if(!feature.properties) { break; }
            feature.properties.text = `
                <b>${feature.properties.label}</b><br>
                <b>Coordinates : (${shapeData.lat}, ${shapeData.lon})</b><br>
                wind speed = ${speed} km/h<br>
                date = ${formatDate(shapeData.datetime, 'yyyy-MM-dd', 'en-US')}<br>
                time = ${formatDate(shapeData.datetime, 'HH:mm', 'en-US')}<br>
                step = ${shapeData.step}`;
        }

        return shapeData;
    }

    updateInputs(): void {
        this.getInputs().subscribe((gribData) => {
            this.inputs = gribData;
            this.emitInputsSubject();
        });
    }

    preloadedResultRequest(payload: any): void {
        this.getResult(payload, 'prediction_request').subscribe((shapeData) => {
            this.addResult(shapeData);
        })
    }

    realtimeResultRequest(payload: any): void {
        this.getResult(payload, 'realtime_prediction_request').subscribe((shapeData) => {
            this.addResult(shapeData);
        })
    }

    addResult(shapeData: ShapeData): void {
        this.results.push(shapeData);
        this.emitResult(shapeData);
    }

    emitInputsSubject() {
        this.inputsSubject.next(this.inputs);
    }

    // emitResultsSubject() {
    //   this.resultsSubject.next(this.results);
    // }

    emitResult(result: ShapeData): void {
        this.resultsSubject.next(result);
    }
}
