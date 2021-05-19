import { SubscriptionsContainer } from './../../../../models/subscriptions-container';
import { NotificationService } from './../../../../services/notification.service';
import { WebsocketService } from './../../../../services/websocket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Form } from './../../../../models/form';
import { FormService } from './../../../../services/form.service';
import { FormItem } from './../../../../interfaces/form-item';
import { Atp45RequestService } from './../../../../services/atp45-request.service';
import { MapService } from './../../../../services/map.service';
import {
    wrongLatValidator,
    wrongLonValidator,
} from 'src/app/shared/validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-realtime',
    templateUrl: './realtime.component.html',
    styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent implements OnInit, OnDestroy {
    formItems: any[] = [
        {
            controlName: 'startdate',
            label: 'Forecast step selection',
            type: 'select',
            validators: [Validators.required],
            placeholder: [],
        },
        {
            controlName: 'lat',
            label: 'Release latitude [°]',
            type: 'input',
            hint: '[-90.0°, 90.0°]',
            validators: [wrongLatValidator(), Validators.required],
        },
        {
            controlName: 'lon',
            label: 'Release longitude [°]',
            type: 'input',
            hint: '[-180°, 180°]',
            validators: [wrongLonValidator(), Validators.required],
        },
    ];

    form: Form = new Form(this.formItems);
    
    formGroup: FormGroup;
    mapSubscription: Subscription;
    wsSubscription: Subscription;

    constructor(
        private mapService: MapService,
        private atp45Service: Atp45RequestService,
        private formService: FormService,
        private websocketService: WebsocketService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.formGroup = this.formService.initForm(this.form);
        this.getRealtimeAvailableSteps();
        this.mapService.onClickInit();

        this.mapSubscription = this.mapService.mapSubject.subscribe(
            (cbrnMap: any) => {
                let marker = cbrnMap.marker;
                this.formGroup.patchValue({
                    lon: `${marker.lon}`,
                    lat: `${marker.lat}`,
                });
            }
        );

        this.formGroup.get('lat')?.valueChanges.subscribe(() => {
            this.emitIfValid();
        });

        this.formGroup.get('lon')?.valueChanges.subscribe(() => {
            this.emitIfValid();
        });

        this.formService.newCurrentForm(this.formGroup);

        this.initWsSubscription();
    }

    onSubmit() {
        const notifTitle = this.notificationService.addNotif('ATP45 Prediction', 'atp45Request');
        this.notificationService.changeStatus(notifTitle, 'pending');

        const atp45Input = {
            datetime: this.formService.removeTimeZone(this.form.get('startdate').placeholder[0].datetime),
            lat: this.formGroup.get('lat')?.value,
            lon: this.formGroup.get('lon')?.value,
            step: this.formGroup.get('startdate')?.value.step,
            ws_info: {channel: this.websocketService.channel, backid: notifTitle},
        }

        this.atp45Service.getAtp45RealtimePrediction(atp45Input).subscribe({
            next: (shapeData: any) => {
                shapeData = this.formService.handlePredictionResponse(shapeData);
                this.mapService.cbrnMap.drawShapes(shapeData);
                this.notificationService.changeStatus(notifTitle, 'succeeded');
            },
            error: (error: HttpErrorResponse) => {
                this.notificationService.changeStatus(notifTitle, 'failed');
                alert(error.message);
            }
        })
    }

    emitIfValid() {
        if (this.formGroup.get('lat')?.valid && this.formGroup.get('lon')?.valid) {
            this.formService.emitCurrentForm();
        }
    }

    getRealtimeAvailableSteps() {
        this.atp45Service.getRealtimeAvailableSteps().subscribe({
            next: (data: any) => {
                let steps = data;
                steps.forEach((element: any) => {
                    element.datetime = new Date(element.datetime);
                });
                this.formItems.forEach((element: FormItem, index: number) => {
                    if (element.controlName === 'startdate') {
                        this.formItems[index].placeholder = steps;
                    }
                });
                this.formGroup.get('startdate')?.setValue(steps[0]);
            },
        });
    }

    initWsSubscription() {
        this.wsSubscription = this.websocketService.connection$.subscribe(
            msg => {
                if (msg.payload !== undefined) {
                    this.notificationService.addContent(msg.payload.backid, msg.payload.displayed);
                }
            },
            err => console.error("Error in receiving realtime ATP45 output" + err)
        );
    }

    ngOnDestroy() {
        this.mapSubscription.unsubscribe();
        this.wsSubscription.unsubscribe();
        this.mapService.offClickEvent();
    }
}
