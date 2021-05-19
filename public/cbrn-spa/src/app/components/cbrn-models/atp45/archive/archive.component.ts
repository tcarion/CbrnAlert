import { WebsocketService } from './../../../../services/websocket.service';
import { NotificationService } from './../../../../services/notification.service';
import { FormService } from './../../../../services/form.service';
import { Form } from './../../../../models/form';
import { Atp45RequestService } from './../../../../services/atp45-request.service';
import { CbrnMap } from './../../../../models/cbrn-map';
import { Subscription } from 'rxjs';
import { MapService } from './../../../../services/map.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, OnDestroy {
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
            placeholder: ["00:00:00", "12:00:00"],
            validators: [Validators.required]
        },
        {
            controlName: 'areaToRetrieve',
            label: 'Area to retrieve',
            type: 'input',
            validators: [Validators.required]
        },
    ]

    form: Form = new Form(this.formItems);

    formGroup: FormGroup;
    mapSubscription: Subscription;
    wsSubscription: Subscription;

    constructor(
        private formService: FormService,
        private mapService: MapService,
        private atp45RequestService: Atp45RequestService,
        private notificationService: NotificationService,
        private websocketService: WebsocketService) { }

    ngOnInit(): void {
        this.formGroup = this.formService.initForm(this.form);
        this.formGroup.get('areaToRetrieve')?.disable();
        this.formGroup.get('forecastTime')?.patchValue(this.formItems[1].placeholder[0]);

        this.mapService.cbrnMap.addDrawControl();
        this.mapService.onAreaSelectionInit();

        this.mapSubscription = this.mapService.mapSubject.subscribe({
            next: (cbrnMap: CbrnMap) => {
                let area = cbrnMap.layerToArea(cbrnMap.areaSelection);
                area = area.map((e) => Math.round(e * 100) / 100)
                this.formGroup.get('areaToRetrieve')?.patchValue(area.join(', '))
                this.form.get('areaToRetrieve').placeholder = area;
            }
        });

        this.initWsSubscription();
    }

    onSubmit() {
        const notifTitle = this.notificationService.addNotif('Archive Request', 'archiveRequest');
        this.notificationService.changeStatus(notifTitle, 'pending');

        const datetime = this.formService.toDate(this.formGroup.get('forecastDate')?.value, this.formGroup.get('forecastTime')?.value);

        const archiveInput = {
            datetime: this.formService.removeTimeZone(datetime),
            area: this.formItems[2].placeholder,
            ws_info: {channel: this.websocketService.channel, backid: notifTitle},
        }

        this.atp45RequestService.archiveRetrieval(archiveInput).subscribe({
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

    initWsSubscription() {
        this.wsSubscription = this.websocketService.connection$.subscribe(
            msg => {
                if (msg.payload !== undefined) {
                    this.notificationService.addContent(msg.payload.backid, msg.payload.displayed);
                }
            },
            err => console.error("Error in receiving archive request output" + err)
        );
    }

    ngOnDestroy() {
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();

        this.wsSubscription.unsubscribe();
    }

}
