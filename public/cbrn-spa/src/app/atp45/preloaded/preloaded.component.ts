import { Atp45Service } from './../atp45.service';
import { SelectionTableComponent } from 'src/app/shared/selection-table/selection-table.component';
import { Subject, Subscription } from 'rxjs';
import { GribData } from '../grib-data';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AroundPipe } from 'src/app/core/pipes/around.pipe';

const columnInfo = [
    {
        name: 'startDate',
        text: 'Start Date',
        width: 140,
        withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] },
        sort: true
    },
    {
        name: 'duration',
        text: 'Duration',
        width: 70,
    },
    {
        name: 'area',
        text: 'Area',
        width: 140,
        withPipe: { pipe: AroundPipe }
    }
]
@Component({
    selector: 'app-preloaded',
    templateUrl: './preloaded.component.html',
    styleUrls: ['./preloaded.component.scss']
})

export class PreloadedComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('selectionTableRef') selectionTableRef: SelectionTableComponent<GribData>;

    displayedColumns = ['select', 'startDate', 'duration', 'area'];
    columnInfo = columnInfo;

    newSelectionSubject = new Subject<GribData>();

    inputsSubscription: Subscription;

    constructor(private atp45Service: Atp45Service) {}

    ngOnInit() {
        this.atp45Service.updateInputs();
    }

    ngAfterViewInit(): void {
        this.inputsSubscription = this.atp45Service.inputs$.subscribe(
            (inputs) => {
                this.selectionTableRef.populateTable(inputs);
            }
        )
    }

    emitSelection(fpInput: GribData) {
        this.newSelectionSubject.next(fpInput);
    }

    ngOnDestroy() {
        this.inputsSubscription.unsubscribe();
    }

}
