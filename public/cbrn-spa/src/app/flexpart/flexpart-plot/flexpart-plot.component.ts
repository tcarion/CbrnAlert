import { Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SelectionTableComponent } from 'src/app/shared/selection-table/selection-table.component';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
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
    {
        name: 'dataDirname',
        text: 'Name',
        width: 60,
    },
]

@Component({
  selector: 'app-flexpart-plot',
  templateUrl: './flexpart-plot.component.html',
  styleUrls: ['./flexpart-plot.component.scss']
})
export class FlexpartPlotComponent implements OnInit, OnDestroy {

    @ViewChild('selectionTableRef') selectionTableRef: SelectionTableComponent<FlexpartResult>;
    // @ViewChild(FlexpartPlotFormComponent) plotFormComp: FlexpartPlotFormComponent;

    displayedColumns = ['select', 'startDate', 'endDate',];
    columnInfo = columnInfo;

    fpResult: FlexpartResult;

    resultsSubscription: Subscription;

    constructor(
        private flexpartService: FlexpartService
        ) {}

    ngOnInit(): void {
        this.flexpartService.updateResults();
    }

    ngAfterViewInit() {
        this.resultsSubscription = this.flexpartService.resultsSubject.subscribe(
            (results) => {
                results.forEach((result) => {
                    if (!('description' in result)) {
                        result.description = {
                            "Dir name": result.dataDirname,
                            "Grid size (dx/dy)": `${result.dx}/${result.dy}`,
                            // "Nbr of particles": 
                        }
                    }
                })
                this.selectionTableRef.populateTable(results);
            }
        )
    }

    emitSelection(fpResult: FlexpartResult) {
        this.fpResult = fpResult;
    }

    ngOnDestroy() {
        this.resultsSubscription.unsubscribe();
    }
}
