import { SelectionTableComponent } from 'src/app/components/selection-table/selection-table.component';
import { Subject } from 'rxjs';
import { GribData } from './../../../../interfaces/atp45/grib-data';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AroundPipe } from 'src/app/pipes/around.pipe';

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

export class PreloadedComponent implements AfterViewInit {

    @ViewChild('selectionTableRef') selectionTableRef: SelectionTableComponent<GribData>;

    displayedColumns = ['select', 'startDate', 'duration', 'area'];
    columnInfo = columnInfo;

    newSelectionSubject = new Subject<GribData>();

    constructor() {}

    ngAfterViewInit(): void {
        this.selectionTableRef.populateWithRequest("atp45", "available_gribfiles", (data: any) => {
            data.forEach((element: any) => {
                element.startdate = new Date(element.startdate);
            });
            return data;
        });
    }

    emitSelection(fpInput: GribData) {
        this.newSelectionSubject.next(fpInput);
    }

}
