import { AroundPipe } from 'src/app/pipes/around.pipe';
import { ApiRequestsService } from './../../../../services/api-requests.service';
import { WebsocketService } from './../../../../services/websocket.service';
import { NotificationService } from './../../../../services/notification.service';
import { FormService } from './../../../../services/form.service';
import { CbrnMap } from './../../../../models/cbrn-map';
import { Subscription } from 'rxjs';
import { MapService } from './../../../../services/map.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { FormComponent } from 'src/app/components/form/form.component';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent extends AbstractWsComponent implements OnInit, OnDestroy, AfterViewInit {
    formItems: any[] = [
        {
            controlName: 'forecastDate',
            label: 'Date of the forecast',
            type: 'datepicker',
            validators: [Validators.required],
            minMaxDate: {max: new Date()}
        },
        {
            controlName: 'forecastTime',
            label: 'Forecast starting time',
            type: 'select',
            value: {
                obj: ["00:00:00", "12:00:00"], 
                display: ["00:00:00", "12:00:00"]
            },
            validators: [Validators.required]
        },
        {
            controlName: 'areaToRetrieve',
            label: 'Area to retrieve',
            type: 'input',
            value: {
                obj: [], 
                display: [], 
                withPipe: { pipe: AroundPipe }
            },
            validators: [Validators.required],
            pipe: AroundPipe,
        },
    ]

    @ViewChild('appForm') appForm: FormComponent;

    mapSubscription: Subscription;

    constructor(
        public formService: FormService,
        private mapService: MapService,
        private requestService: ApiRequestsService,
        public notificationService: NotificationService,
        public websocketService: WebsocketService) {
            super(websocketService, notificationService);
         }
    
    
    ngAfterViewInit() {
        this.appForm.formGroup.get('areaToRetrieve')?.disable();
        this.appForm.formGroup.get('forecastTime')?.patchValue(this.appForm.form.get('forecastTime')?.value?.obj[0]);

        this.mapSubscription = this.mapService.mapSubject.subscribe({
            next: (cbrnMap: CbrnMap) => {
                let area = cbrnMap.layerToArea(cbrnMap.areaSelection);
                this.appForm.form.newVal('areaToRetrieve', area);
            }
        });

    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mapService.cbrnMap.addDrawControl();
        this.mapService.onAreaSelectionInit();
    }

    onSubmit() {
        const notifTitle =  this.notificationService.addNotif('Archive Request', 'archiveRequest');

        const datetime = this.formService.toDate(this.appForm.formGroup.get('forecastDate')?.value, this.appForm.formGroup.get('forecastTime')?.value);

        const archiveInput = {
            datetime: this.formService.removeTimeZone(datetime),
            area: this.appForm.form.get("areaToRetrieve")?.value?.obj,
            ws_info: {channel: this.websocketService.channel, backid: notifTitle},
        }

        const payload = {
            ...archiveInput,
            request: "archive_retrieval"
        }
        this.requestService.atp45Request(payload).subscribe({
            next: () => {
                alert("Archive data have been received");
                this.notificationService.changeStatus(notifTitle, 'succeeded');

            },
            error: (error) => {
                console.log(error);
                this.notificationService.changeStatus(notifTitle, 'failed');
            }
        })
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();
    }

}
