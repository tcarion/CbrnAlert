import { FlexpartOutput } from './flexpart-output';
import { Observable, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { ApiService } from '../core/services/api.service';
import { FlexpartPlotData } from './flexpart-plot-data';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { NotificationService } from '../core/services/notification.service';
import { WebsocketService } from '../core/services/websocket.service';
import { MapService } from '../core/services/map.service';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { AuthenticationService } from '../core/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class FlexpartService {

    inputs: FlexpartInput[] = [];
    results: FlexpartResult[] = [];
    // plots: FlexpartPlotData[] = [];

    inputsSubject = new Subject<FlexpartInput[]>();
    resultsSubject = new Subject<FlexpartResult[]>();
    // plotsSubject = new Subject<FlexpartPlot>();

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private websocketService: WebsocketService,
        private mapPlotsService: MapPlotsService,
        private authenticationService: AuthenticationService,
    ) { }

    getInputs(): Observable<FlexpartInput[]> {
        return this.apiService
            .get('/flexpart/inputs')
            .pipe(
                map((data: any) => {
                    data.forEach((element: any) => {
                        element.startDate = new Date(element.startDate);
                        element.endDate = new Date(element.endDate);
                    });
                    return <FlexpartInput[]>data;
                })
            );
    }

    getResults(): Observable<FlexpartResult[]> {
        // return this.apiService
        //     .flexpartRequest({request: 'flexpart_results'})
        //     .pipe(
        //         map((data: any) => {
        //             data.forEach((element: any) => {
        //                 element.startDate = new Date(element.startDate);
        //                 element.endDate = new Date(element.endDate);
        //             });
        //             return <FlexpartResult[]>data;
        //         })
        //     );
        return this.apiService.get('/flexpart/results')
            // .pipe(map(results => results.filter((res: FlexpartResult) => res.outputs !== undefined)))
    }

    getResult(id: string): Observable<FlexpartResult> {
        return this.apiService.get('/flexpart/results/' + id)
    }

    getOutputs(resultId: string): Observable<FlexpartOutput[]> {
        return this.apiService.get('/flexpart/results/' + resultId + '/outputs')
    }

    getOutput(resultId: string, outputId: string): Observable<FlexpartOutput> {
        return this.apiService.get('/flexpart/results/' + resultId + '/outputs/' + outputId)
    }


    meteoDataRetrieval(payload: any) {
        const notifTitle = this.notificationService.addNotif('Met data retrieval', 'metDataRequest');

        const plWs = {...payload,
            ws_info: { channel: this.websocketService.channel, backid: notifTitle },
        }

        console.log(plWs);
        return this.apiService.post('/flexpart/meteo_data_request', plWs).pipe(
            catchError((err) => {
                this.notificationService.changeStatus(notifTitle, 'failed');
                return throwError(err);
            }),
            tap(() => {
                alert("Meteorological data has been retrieved");
                this.notificationService.changeStatus(notifTitle, 'succeeded');
            })
        );
    }

    updateInputs(): void {
        this.getInputs().subscribe((flexpartInputs) => {
            this.inputs = flexpartInputs;
            this.emitInputsSubject();
        });
    }

    // updateResults(): void {
    //     this.getResultsFromServer().subscribe((flexpartResults) => {
    //         this.results = flexpartResults;
    //         this.emitResultsSubject();
    //     });
    // }

    runFlexpart(formFields: any): void {
        const notifTitle = this.notificationService.addNotif('Flexpart Run', 'flexpartRun');
        const payload = {
            ...formFields,
            ws_info: { channel: this.websocketService.channel, backid: notifTitle },
            request: 'flexpart_run'
        }

        this.apiService.post('/flexpart/run',payload).subscribe({
            next: () => {
                alert("Flexpart run done");
                this.notificationService.changeStatus(notifTitle, 'succeeded');
            },
            error: (error) => {
                alert(error.info);
                this.notificationService.changeStatus(notifTitle, 'failed');
            }
        })
    }

    // newPlot(formFields: any): void {
    //     console.log(formFields);

    //     const payload = {
    //         ...formFields,
    //         request: "flexpart_geojson_conc"
    //     };

    //     this.apiService.flexpartRequest(payload).subscribe({
    //         next: (flexpartPlotData: any) => {
    //             // this.plots.push(flexpartPlotData);
    //             this.mapPlotsService.addFlexpartPlot(flexpartPlotData);
    //             // console.log(flexpartPlotData.cells);
    //             // console.log('received :' + data);
    //             // this.mapService.cbrnMap.addGeoJsonLayer(data);
    //         },
    //         error: (error) => {
    //             alert(error.info);
    //         }
    //     })
    // }

    newPlot(resultId:string, outputId:string,formFields: any): Observable<any> {
        return this.apiService.post('/flexpart/results/'+resultId+'/output/'+outputId, formFields);
    }

    dailyAverage(resultId:string, outputId:string) {

        this.apiService.post('/flexpart/results/'+resultId+'/output/'+outputId).subscribe({
            next: () => {
                // this.plots.push(flexpartPlotData);
                alert("Average added");
                // console.log(flexpartPlotData.cells);
                // console.log('received :' + data);
                // this.mapService.cbrnMap.addGeoJsonLayer(data);
            },
        })
    }

        // dailyAverage(dirname: string) {
    //     const payload = {
    //         dataDirname: dirname,
    //         request: "flexpart_daily_average"
    //     };

    //     this.apiService.flexpartRequest(payload).subscribe({
    //         next: (flexpartPlotData: any) => {
    //             // this.plots.push(flexpartPlotData);
    //             alert("Average added");
    //             // console.log(flexpartPlotData.cells);
    //             // console.log('received :' + data);
    //             // this.mapService.cbrnMap.addGeoJsonLayer(data);
    //         },
    //     })
    // }

    emitInputsSubject() {
        this.inputsSubject.next(this.inputs);
    }

    emitResultsSubject() {
        this.resultsSubject.next(this.results);
    }
}
