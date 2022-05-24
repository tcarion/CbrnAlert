import { ApiService } from 'src/app/core/api/services';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { ApiService_old } from '../core/services/api.service';
import { FlexpartPlotData } from './flexpart-plot-data';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { NotificationService } from '../core/services/notification.service';
import { WebsocketService } from '../core/services/websocket.service';
import { MapService } from '../core/services/map.service';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { FlexpartOutput, FlexpartRun } from 'src/app/core/api/models';
import { QuestionBase } from '../shared/form/question-base';
import { DropdownQuestion } from '../shared/form/dropdown-question';

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
        private apiService_old: ApiService_old,
        private apiService: ApiService,
        private notificationService: NotificationService,
        private websocketService: WebsocketService,
        private mapPlotsService: MapPlotsService,
        private authenticationService: AuthenticationService,
    ) { }

    getInputs(): Observable<FlexpartInput[]> {
        return this.apiService_old
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

    getRuns(): Observable<FlexpartRun[]> {
        return this.apiService.flexpartRunsGet()
    }

    getRun(runId: string): Observable<FlexpartRun> {
        return this.apiService.flexpartRunsRunIdGet({runId})
    }

    getOutputs(runId: string): Observable<FlexpartOutput[]> {
        return this.apiService.flexpartRunsRunIdOutputsGet({runId})
    }

    getOutput(runId: string, outputId: string): Observable<FlexpartOutput> {
        return this.apiService.flexpartRunsRunIdOutputsOutputIdGet({ runId, outputId })
    }

    getSpatialLayers(outputId: string): Observable<string[]> {
        return this.apiService.flexpartOutputsOutputIdLayersGet( {outputId, spatial: true} )
    }

    getZDims(outputId: string, layer: string): Observable<Object> {
        return this.apiService.flexpartOutputsOutputIdDimensionsGet({outputId, layer, horizontal: false})
    }

    getSlice(outputId: string, layerName: string, dimensions:Object) {
        return this.apiService.flexpartOutputsOutputIdSlicePost({
            outputId,
            layer: layerName,
            geojson: true,
            legend: true,
            body: dimensions
        })
    }

    getDimsQuestions(outputId: string, layer: string) {
        const questions: QuestionBase<any>[] = []
        this.getZDims(outputId, layer).subscribe(dims => {
            console.log(dims)
            for (const [key, values] of Object.entries(dims as { [k: string]: string[] | number[]})) {
                const kvs = values.map( (v) => {
                    return {key:v as string, value: v as string}
                })
                questions.push(new DropdownQuestion({
                    key: key,
                    label: key,
                    options: kvs,
                    required: true,
                    value: values[0],
                    // order: 3
                }))
                // this.formGroup.addControl(key, new FormControl(values[0]))
                // this.dimNames.push(key);
                // this.dimValues.push(values);
            }
        })
        return of(questions);
    }
    meteoDataRetrieval(payload: any) {
        const notifTitle = this.notificationService.addNotif('Met data retrieval', 'metDataRequest');

        const plWs = {...payload,
            ws_info: { channel: this.websocketService.channel, backid: notifTitle },
        }

        console.log(plWs);
        return this.apiService_old.post('/flexpart/meteo_data_request', plWs).pipe(
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

        this.apiService_old.post('/flexpart/run',payload).subscribe({
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
        return this.apiService_old.post('/flexpart/results/'+resultId+'/output/'+outputId, formFields);
    }

    dailyAverage(resultId:string, outputId:string) {

        this.apiService_old.post('/flexpart/results/'+resultId+'/output/'+outputId).subscribe({
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
