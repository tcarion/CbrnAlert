import { AroundPipe } from 'src/app/core/pipes/around.pipe';

import { CbrnMap } from '../../core/models/cbrn-map';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { ApiService_old } from 'src/app/core/services/api.service';
import { MapService } from 'src/app/core/services/map.service';
import { FormService } from 'src/app/core/services/form.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { NotificationService } from 'src/app/core/services/notification.service';

import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { DatepickerFormItem } from 'src/app/shared/form/form-item-datepicker';
import { TextFormItem } from 'src/app/shared/form/form-item-text';
import { FormItems } from 'src/app/shared/form/form-items';
import { FlexpartService } from '../flexpart.service';


const formItems: FormItemBase[] = [

    new DatepickerFormItem({
        key: 'startDay',
        label: 'Starting day',
        required: true,
        minmax: {max: new Date()}
    }),
    new SelectFormItem({
        key: 'startTime',
        label: 'Starting time',
        required: true,
        autoSelect: true,
        options: [
            {key: "00:00:00"},
            {key: "12:00:00"},
        ]
    }),
    new DatepickerFormItem({
        key: 'endDay',
        label: 'End day',
        required: true,
        minmax: {max: new Date()}
    }),
    new SelectFormItem({
        key: 'endTime',
        label: 'End time',
        required: true,
        autoSelect: true,
        options: [
            {key: "00:00:00"},
            {key: "12:00:00"},
        ]
    }),
    new SelectFormItem({
        key: 'timeStep',
        label: 'Time step [h]',
        required: true,
        autoSelect: true,
        options: [
            {key: 1},
            {key: 3},
            {key: 6},
        ]
    }),
    new SelectFormItem({
        key: 'gridRes',
        label: 'Grid res. [°]',
        required: true,
        autoSelect: true,
        options: [
            {key: 0.1},
            {key: 0.2},
            {key: 0.5},
            {key: 1.},
            {key: 2.},
        ]
    }),
    new TextFormItem({
        key: 'area',
        label: 'Area to retrieve',
        type: 'mapObject',
        required: true,
        disabled: true,
        mapper: (a: number[]) => a.map(e => Math.round(e * 100)/100).join(', ')
    }),
]

@Component({
    selector: 'app-met-data',
    templateUrl: './met-data.component.html',
    styleUrls: ['./met-data.component.scss']
})
export class MetDataComponent extends AbstractWsComponent implements OnInit, OnDestroy, AfterViewInit {

    formItems = new FormItems(formItems);

    formGroup: FormGroup;

    mapSubscription: Subscription;

    constructor(
        private mapService: MapService,
        private flexpartService: FlexpartService,
        public formService: FormService,
        public websocketService: WebsocketService,
        public notificationService: NotificationService
    ) { 
        super(websocketService, notificationService);
    }

    ngAfterViewInit() {
        this.mapSubscription = this.mapService.mapEventSubject.subscribe({
            next: (event) => {
                if (event == 'areaSelection') {
                    let area = this.mapService.cbrnMap.layerToArea(this.mapService.cbrnMap.areaSelection);
                    this.formGroup.get('area')?.patchValue(area);
                }
            }
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        this.mapService.addDrawControl();
        this.mapService.onAreaSelectionInit();
    }

    onSubmit() {
        let formFields = this.formGroup.value;
        
        formFields.startDate = this.formService.removeTimeZone(this.formService.toDate(formFields.startDay, formFields.startTime));
        formFields.endDate = this.formService.removeTimeZone(this.formService.toDate(formFields.endDay, formFields.endTime));

        this.flexpartService.meteoDataRetrieval(formFields).subscribe();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();
    }

}
