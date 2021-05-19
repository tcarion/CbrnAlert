import { FlexpartRequestService } from './../../../../services/flexpart-request.service';
import { CbrnMap } from './../../../../models/cbrn-map';
import { NotificationService } from './../../../../services/notification.service';
import { WebsocketService } from './../../../../services/websocket.service';
import { FormService } from './../../../../services/form.service';
import { Atp45RequestService } from './../../../../services/atp45-request.service';
import { MapService } from './../../../../services/map.service';
import { Subscription } from 'rxjs';
import { Form } from './../../../../models/form';
import { wrongLatValidator, wrongLonValidator } from 'src/app/shared/validators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-met-data',
    templateUrl: './met-data.component.html',
    styleUrls: ['./met-data.component.scss']
})
export class MetDataComponent implements OnInit, OnDestroy {

    formItems: any[] = [
        {
            controlName: 'startDay',
            label: 'Starting date',
            type: 'datepicker',
            validators: [Validators.required],
            minMaxDate: {max: new Date()}
        },
        {
            controlName: 'startTime',
            label: 'Starting time',
            type: 'select',
            placeholder: ['00:00:00', '12:00:00'],
            validators: [Validators.required],
        },
        {
            controlName: 'endDay',
            label: 'End date',
            type: 'datepicker',
            validators: [Validators.required],
            minMaxDate: {max: new Date()}
        },
        {
            controlName: 'endTime',
            label: 'End time',
            type: 'select',
            placeholder: ['00:00:00', '12:00:00'],
            validators: [Validators.required],
        },
        {
            controlName: 'timeStep',
            label: 'Time step [h]',
            type: 'select',
            placeholder: [1, 3, 6],
            validators: [Validators.required],
        },
        {
            controlName: 'gridRes',
            label: 'Grid res. [°]',
            type: 'select',
            placeholder: [0.1, 0.2, 0.5, 1., 2.],
            validators: [Validators.required],
        },
        {
            controlName: 'areaToRetrieve',
            label: 'Area to retrieve',
            type: 'input',
            validators: [Validators.required],
        },
    ];

    form: Form = new Form(this.formItems);

    formGroup: FormGroup;
    mapSubscription: Subscription;
    wsSubscription: Subscription;

    constructor(
        private mapService: MapService,
        private flexpartService: FlexpartRequestService,
        private formService: FormService,
        private websocketService: WebsocketService,
        private notificationService: NotificationService
    ) { }

    onSubmit() {
        const notifTitle = this.notificationService.addNotif('Met data retrieval', 'metDataRequest');
        this.notificationService.changeStatus(notifTitle, 'pending');

        let formFields = this.formService.formToObject();
        
        formFields.startDate = this.formService.removeTimeZone(this.formService.toDate(formFields.startDay, formFields.startTime));
        formFields.endDate = this.formService.removeTimeZone(this.formService.toDate(formFields.endDay, formFields.endTime));

        formFields.areaToRetrieve = formFields.areaToRetrieve.split(',').map((x:string) => parseFloat(x))

        formFields = {
            ...formFields,
            ws_info: {channel: this.websocketService.channel, backid: notifTitle},
        }
        console.log(formFields);
        this.flexpartService.retrieveMetData(formFields).subscribe({
            next: () => {
                alert("Meteorological data has been retrieved");
                this.notificationService.changeStatus(notifTitle, 'succeeded');
            },
            error: (error) => {
                alert(error.info);
                this.notificationService.changeStatus(notifTitle, 'failed');
            }
        })
    }

    ngOnInit(): void {
        this.formGroup = this.formService.initForm(this.form);

        this.formGroup.get('areaToRetrieve')?.disable();

        this.mapService.cbrnMap.addDrawControl();
        this.mapService.onAreaSelectionInit();

        this.mapSubscription = this.mapService.mapSubject.subscribe({
            next: (cbrnMap: CbrnMap) => {
                let area = cbrnMap.layerToArea(cbrnMap.areaSelection);
                area = area.map((e) => Math.round(e * 10) / 10)
                this.formGroup.get('areaToRetrieve')?.patchValue(area.join(', '))
                this.form.get('areaToRetrieve').placeholder = area;
            }
        });

        this.formService.newCurrentForm(this.formGroup);

        this.initWsSubscription();
    }

    initWsSubscription() {
        this.wsSubscription = this.websocketService.connection$.subscribe(
            msg => {
                if (msg.payload !== undefined) {
                    this.notificationService.addContent(msg.payload.backid, msg.payload.displayed);
                }
            },
            err => console.error("Error in receiving met data output" + err)
        );
    }

    ngOnDestroy() {
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();

        this.wsSubscription.unsubscribe();
    }

}
