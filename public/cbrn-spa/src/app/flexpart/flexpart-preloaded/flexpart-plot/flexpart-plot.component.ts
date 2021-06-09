import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SelectionTableComponent } from 'src/app/shared/selection-table/selection-table.component';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
import { FlexpartPlotFormComponent } from './flexpart-plot-form/flexpart-plot-form.component';
import { FlexpartService } from '../../flexpart.service';

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
  selector: 'app-flexpart-plot',
  templateUrl: './flexpart-plot.component.html',
  styleUrls: ['./flexpart-plot.component.scss']
})
export class FlexpartPlotComponent implements OnInit {

    @ViewChild('selectionTableRef') selectionTableRef: SelectionTableComponent<FlexpartResult>;
    @ViewChild(FlexpartPlotFormComponent) plotFormComp: FlexpartPlotFormComponent;

    displayedColumns = ['select', 'startDate', 'endDate'];
    columnInfo = columnInfo;

    newSelectionSubject = new Subject<FlexpartResult>();

    constructor(
        private flexpartService: FlexpartService
        ) {}

    ngOnInit(): void {
        this.flexpartService.getResultsFromServer();
    }

    ngAfterViewInit() {
        this.flexpartService.resultsSubject.subscribe(
            (results) => {
                this.selectionTableRef.populateTable(results);
            }
        )
    }

    emitSelection(fpInput: FlexpartResult) {
        this.newSelectionSubject.next(fpInput);
    }

    ngOnDestroy() {

    }
}
