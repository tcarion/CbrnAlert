import { ApiRequestsService } from './../../../../services/api-requests.service';
import { GribData } from './../../../../interfaces/atp45/grib-data';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectionTableComponent } from 'src/app/abstract-classes/abstract-selection-table-component';
import { DatePipe } from '@angular/common';
import { AroundPipe } from 'src/app/pipes/around.pipe';

@Component({
    selector: 'app-preloaded',
    templateUrl: './preloaded.component.html',
    styleUrls: ['./preloaded.component.scss']
})

export class PreloadedComponent extends AbstractSelectionTableComponent<GribData> implements OnInit, AfterViewInit {

    constructor(public requestService: ApiRequestsService) {
        super(requestService);
    }

    ngOnInit(): void {
        this.displayedColumns = ['select', 'startDate', 'duration', 'area'];
        this.columnInfo = [
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
        // this.getAvailableGribFiles();
        this.populateWithRequest("atp45", "available_gribfiles", (data: any) => {
            data.forEach((element: any) => {
                element.startdate = new Date(element.startdate);
            });
            return data;
        });
    }

    // getAvailableGribFiles() {
    //     const payload = {request: "available_gribfiles"}
    //     this.requestService.atp45Request(payload).subscribe(
    //         (data: any) => {
    //             let gribdata = data;
    //             gribdata.forEach((element: any) => {
    //                 element.startdate = new Date(element.startdate);
    //             });
    //             this.populateTable(gribdata);
    //         },
    //         (error: HttpErrorResponse) => {
    //             console.error(error.error);
    //         }
    //     )
    // }

}
