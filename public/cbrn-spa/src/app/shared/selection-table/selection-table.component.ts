import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild, AfterViewInit, PipeTransform, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

interface ColumnInfo {
    name: string,
    text: string,
    width: number,
    withPipe?: {
        pipe: any,
        arg?: any
    },
    sort?: boolean
}

@Component({
    selector: 'app-selection-table',
    templateUrl: './selection-table.component.html',
    styleUrls: ['./selection-table.component.scss']
})
export class SelectionTableComponent<T> implements AfterViewInit, OnDestroy {

    dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();;
    selection = new SelectionModel<T>(false, []);

    @Input() columnInfo: ColumnInfo[];
    @Input() displayedColumns: string[];

    @Output() newSelectionEvent = new EventEmitter<T>();

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        // public apiService: ApiService
    ) { }

    ngOnInit() {
        this.selection.changed.subscribe((s) => {
            this.newSelectionEvent.emit(s.added[0]);
        })
    }

    // populateWithRequest(api: string, request: string, postProcess: Function) {
    //     const payload = { request: request }
    //     let req = api === "atp45" ? this.apiService.atp45Request(payload) : this.apiService.flexpartRequest(payload)
    //     req.subscribe(
    //         (data: any) => {
    //             data = postProcess(data);
    //             this.populateTable(data);
    //         },
    //         (error: HttpErrorResponse) => {
    //             console.error(error.error);
    //         }
    //     )
    // }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    populateTable(data: T[]) {
        this.dataSource.data = data;
    }

    ngOnDestroy() {
    }
}
