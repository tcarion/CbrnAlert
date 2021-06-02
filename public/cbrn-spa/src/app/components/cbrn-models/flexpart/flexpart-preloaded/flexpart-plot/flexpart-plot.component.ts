import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SelectionTableComponent } from 'src/app/components/selection-table/selection-table.component';
import { FlexpartResult } from 'src/app/interfaces/flexpart/flexpart-result';

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

    displayedColumns = ['select', 'startDate', 'endDate'];
    columnInfo = columnInfo;

    newSelectionSubject = new Subject<FlexpartResult>();

    constructor() {}

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.selectionTableRef.populateWithRequest("flexpart", "flexpart_results", (data: any) => {
            data.forEach((element: any) => {
                element.startDate = new Date(element.startDate);
                element.endDate = new Date(element.endDate);
            });
            return <FlexpartResult>data;
        });
    }

    emitSelection(fpInput: FlexpartResult) {
        this.newSelectionSubject.next(fpInput);
    }

    ngOnDestroy() {

    }
}
