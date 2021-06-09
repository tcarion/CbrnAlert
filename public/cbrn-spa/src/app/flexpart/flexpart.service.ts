import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class FlexpartService {
    inputs: FlexpartInput[];
    results: FlexpartResult[];

    inputsSubject = new Subject<FlexpartInput[]>();
    resultsSubject = new Subject<FlexpartResult[]>();

    constructor(
        private apiRequestService: ApiService,
    ) { }

    getInputsFromServer() {
        this.apiRequestService.flexpartRequest({request: 'available_flexpart_input'}).subscribe(
            (data: any) => {
                data.forEach((element: any) => {
                    element.startDate = new Date(element.startDate);
                    element.endDate = new Date(element.endDate);
                });
                let flexpartInput = <FlexpartInput[]>data;
                this.inputs = flexpartInput;
                this.emitInputsSubject();
            }
        );
    }

    getResultsFromServer() {
        this.apiRequestService.flexpartRequest({request: 'flexpart_results'}).subscribe(
            (data: any) => {
                data.forEach((element: any) => {
                    element.startDate = new Date(element.startDate);
                    element.endDate = new Date(element.endDate);
                });
                let flexpartInput = <FlexpartResult[]>data;
                this.results = flexpartInput;
                this.emitResultsSubject();
            }
        );
    }


    emitInputsSubject() {
        this.inputsSubject.next(this.inputs);
    }

    emitResultsSubject() {
        this.resultsSubject.next(this.results);
    }
}
