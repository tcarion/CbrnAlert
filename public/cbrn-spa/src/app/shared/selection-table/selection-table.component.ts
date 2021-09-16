import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild, AfterViewInit, PipeTransform, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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

    dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
    selection = new SelectionModel<T>(false, []);

    selectionSubscription: Subscription;

    @Input() columnInfo: ColumnInfo[];
    @Input() displayedColumns: string[];
    @Input() hasDescriptionCol?: boolean = false;

    @Output() newSelectionEvent = new EventEmitter<T>();

    @ViewChild(MatSort) sort: MatSort;

    constructor(
    ) { 
    }
    
    ngOnInit() {
        this.hasDescriptionCol && this.displayedColumns.push("description");
        this.selectionSubscription = this.selection.changed.subscribe((s) => {
            s.added.length !==0 ? this.newSelectionEvent.emit(s.added[0]) : this.newSelectionEvent.emit(undefined);
        })
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    populateTable(data: T[]) {
        this.dataSource.data = data;
    }

    // onDescriptionClick(row: any) {
    //     console.log(row);
    // }
    ngOnDestroy() {
        this.selectionSubscription.unsubscribe();
    }
}
