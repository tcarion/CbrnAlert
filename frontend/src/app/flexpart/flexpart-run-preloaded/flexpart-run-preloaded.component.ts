import { Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FlexpartInput } from '../flexpart-input';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SelectionTableComponent } from 'src/app/shared/selection-table/selection-table.component';
import { FlexpartRunPreloadedFormComponent } from './flexpart-run-preloaded-form/flexpart-run-preloaded-form.component';
import { FlexpartService } from '../flexpart.service';

const columnInfo = [
    {
        name: 'startDate',
        text: 'Start Date',
        width: 140,
        withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] },
        sort: true
    },
    {
        name: 'endDate',
        text: 'End Date',
        width: 150,
        withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] },
        sort: true
    },
]

@Component({
    selector: 'app-flexpart-run-preloaded',
    templateUrl: './flexpart-run-preloaded.component.html',
    styleUrls: ['./flexpart-run-preloaded.component.scss']
})
export class FlexpartRunPreloadedComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('selectionTableRef') selectionTableRef: SelectionTableComponent<FlexpartInput>;
    // @ViewChild(FlexpartRunPreloadedFormComponent) runFormComp: FlexpartRunPreloadedFormComponent;

    displayedColumns = ['select', 'startDate', 'endDate'];
    columnInfo = columnInfo;

    fpInput: FlexpartInput;

    inputsSubscription: Subscription;

    constructor(
        private flexpartService: FlexpartService
        ) {}

    ngOnInit(): void {
        this.flexpartService.updateInputs();
    }

    ngAfterViewInit() {
        this.inputsSubscription = this.flexpartService.inputsSubject.subscribe(
            (inputs) => {
                this.selectionTableRef.populateTable(inputs);
            }
        )
    }

    emitSelection(fpInput: FlexpartInput) {
        this.fpInput = fpInput;
    }

    ngOnDestroy() {
        this.inputsSubscription.unsubscribe();
    }

}
