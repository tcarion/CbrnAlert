import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService_old } from 'src/app/core/services/api.service';
import { GribData } from './grib-data';
import { Atp45ShapeData } from './shape-data';

import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { FeatureCollection } from 'geojson';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { NotificationService } from '../core/services/notification.service';
import { WebsocketService } from '../core/services/websocket.service';
import { WindAtp45Input } from 'src/app/core/api/v1';

@Injectable({
    providedIn: 'root',
})
export class Atp45Service {
    inputs: GribData[];
    results: Atp45ShapeData[] = [];

    inputsSubject = new BehaviorSubject<GribData[]>([]);
    inputs$ = this.inputsSubject.asObservable();
    // resultSubject = new Subject<Atp45ShapeData>();
    // result$ = this.resultSubject.asObservable();


    constructor(
        private apiService: ApiService_old,
        private mapPlotsService: MapPlotsService,
        private notificationService: NotificationService,
        private websocketService: WebsocketService,
    ) { }

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

    getResult(payload: any, request: string): Observable<Atp45ShapeData> {
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

    /**
     * @param  {any} shapeData
     * @returns Atp45ShapeData
     */
    responseToShapeData(shapeData: any): Atp45ShapeData {
        let shapes = <FeatureCollection>shapeData.shapes;
        shapeData.datetime = new Date(shapeData.datetime);
        let speed = Math.round(shapeData.wind.speed * 3.6 * 10) / 10;

        for (const feature of shapes.features) {
            if (!feature.properties) { break; }
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

    withWindAtp45Request(payload: WindAtp45Input) {

    }

    preloadedResultRequest(payload: any) {
        return this.getResult(payload, 'prediction_request')
    }

    realtimeResultRequest(payload: any) {
        // const notifTitle = this.notificationService.addNotif('ATP45 Prediction', 'atp45Request');
        // const plWs = {...payload,
        //     ws_info: { channel: this.websocketService.channel, backid: notifTitle },
        // }
        // return this.getResult(plWs, 'realtime_prediction_request');
    }

    availablesSteps(gribData: GribData) {
        return this.apiService.atp45Request({
            ...gribData,
            request: "available_steps"
        })
    }

    realtimeAvailableSteps() {
        return this.apiService.atp45Request({
            request: "realtime_available_steps"
        })
    }

    archiveRequest(payload: any) {
        // const notifTitle = this.notificationService.addNotif('Archive Request', 'archiveRequest');
        // const plWs = {...payload,
        //     ws_info: { channel: this.websocketService.channel, backid: notifTitle },
        // }

        // this.apiService.atp45Request({...plWs, request: "archive_retrieval"}).subscribe({
        //     next: () => {
        //         alert("Archive data have been received");
        //         this.notificationService.changeStatus(notifTitle, 'succeeded');

        //     },
        //     error: (error) => {
        //         console.log(error);
        //         this.notificationService.changeStatus(notifTitle, 'failed');
        //     }
        // })
    }

    // addResult(shapeData: Atp45ShapeData): void {
    //     this.results.push(shapeData);
    //     this.mapPlotsService.addAtp45Plot(shapeData);
    //     // this.emitResult(shapeData);
    // }

    emitInputsSubject() {
        this.inputsSubject.next(this.inputs);
    }

    // emitResultsSubject() {
    //   this.resultsSubject.next(this.results);
    // }

    // emitResult(result: Atp45ShapeData): void {
    //     this.resultSubject.next(result);
    // }
}
