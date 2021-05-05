import { GribData } from './../../../../interfaces/atp45/grib-data';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { Atp45RequestService } from './../../../../services/atp45-request.service';
import { FormItem } from './../../../../interfaces/form-item';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-preloaded',
    templateUrl: './preloaded.component.html',
    styleUrls: ['./preloaded.component.scss']
})

export class PreloadedComponent implements OnInit, AfterViewInit {

    @Input() formItems: FormItem[];
    availableGribFiles: GribData[];
    dataSource: MatTableDataSource<GribData> = new MatTableDataSource<GribData>();;
    displayedColumns: string[] = ['select', 'startdate', 'duration', 'area'];
    selection = new SelectionModel<GribData>(false, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private atp45Service: Atp45RequestService) { }

    ngOnInit(): void {
        this.getAvailableGribFiles()
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getAvailableGribFiles() {
        this.atp45Service.getAvailableGribFiles().subscribe(
            (data: any) => {
                let gribdata = data;
                gribdata.forEach((element: any) => {
                    element.startdate = new Date(element.startdate)
                });
                // this.availableGribFiles = gribdata;
                this.dataSource.data = gribdata;
            },
            (error: HttpErrorResponse) => {
                console.error(error.error);
            }
        )
    }

}
