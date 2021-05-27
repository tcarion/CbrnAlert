import { DatePipe } from '@angular/common';
import { ApiRequestsService } from './../../../../../services/api-requests.service';
import { RequestService } from './../../../../../services/request.service';
import { AbstractSelectionTableComponent } from 'src/app/abstract-classes/abstract-selection-table-component';
import { FlexpartInput } from '../../../../../interfaces/flexpart/flexpart-input';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../../../../services/notification.service';
import { WebsocketService } from '../../../../../services/websocket.service';
import { FormService } from '../../../../../services/form.service';
import { MapService } from '../../../../../services/map.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';

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
    selector: 'app-flexpart-run-preloaded',
    templateUrl: './flexpart-run-preloaded.component.html',
    styleUrls: ['./flexpart-run-preloaded.component.scss']
})
export class FlexpartRunPreloadedComponent extends AbstractSelectionTableComponent<FlexpartInput> implements OnInit, OnDestroy {


    constructor(
        requestService: ApiRequestsService
    ) {
        super(requestService);
    }

    ngOnInit(): void {
        this.displayedColumns = ['select', 'startDate', 'endDate'];
        this.columnInfo = columnInfo

        this.populateWithRequest("flexpart", "available_flexpart_input", (data: any) => {
            data.forEach((element: any) => {
                element.startDate = new Date(element.startDate);
                element.endDate = new Date(element.endDate);
            });
            return <FlexpartInput>data;
        });
    }

    ngOnDestroy() {

    }

}
