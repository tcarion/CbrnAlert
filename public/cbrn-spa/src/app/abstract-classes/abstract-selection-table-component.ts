import { HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild, AfterViewInit, PipeTransform } from '@angular/core';
import { ApiRequestsService } from '../services/api-requests.service';

@Component({
    template: ''
})
export abstract class AbstractSelectionTableComponent<T> implements AfterViewInit {
    dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();;
    displayedColumns: string[];
    selection = new SelectionModel<T>(false, []);

    columnInfo: {
        name: string, 
        text: string, 
        width: number, 
        withPipe?: {
            pipe: any, 
            arg?: any
        },
        sort?: boolean
    }[];
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public requestService: ApiRequestsService
    ) {}

    populateWithRequest(api: string, request: string, postProcess: Function) {
        const payload = {request: request}
        let req = api === "atp45" ? this.requestService.atp45Request(payload) : this.requestService.flexpartRequest(payload)
        req.subscribe(
            (data: any) => {
                data = postProcess(data);
                this.populateTable(data);
            },
            (error: HttpErrorResponse) => {
                console.error(error.error);
            }
        )
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    populateTable(data: T[]) {
        this.dataSource.data = data;
    }
}
