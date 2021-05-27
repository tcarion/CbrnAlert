import { FormComponent } from 'src/app/components/form/form.component';
import { ApiRequestsService } from './../../../../services/api-requests.service';
import { SubscriptionsContainer } from './../../../../models/subscriptions-container';
import { NotificationService } from './../../../../services/notification.service';
import { WebsocketService } from './../../../../services/websocket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Form } from './../../../../models/form';
import { FormService } from './../../../../services/form.service';
import { FormItem } from './../../../../interfaces/form-item';
import { MapService } from './../../../../services/map.service';
import {
    wrongLatValidator,
    wrongLonValidator,
} from 'src/app/shared/validators';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-realtime',
    templateUrl: './realtime.component.html',
    styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent extends AbstractWsComponent implements OnInit, OnDestroy, AfterViewInit {
    formItems: FormItem[] = [
        {
            controlName: 'startdate',
            label: 'Forecast step selection',
            type: 'select',
            validators: [Validators.required],
            value: {
                obj: [],
                display: [],
                withPipe: {
                    pipe: DatePipe,
                    arg: ["YYYY-MM-dd @ HH:mm"]
                }
            },
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

    @ViewChild('appForm') appForm: FormComponent;

    mapSubscription: Subscription;

    _latSubscription?: Subscription;
    _lonSubscription?: Subscription;

    constructor(
        private mapService: MapService,
        private requestService: ApiRequestsService,
        public formService: FormService,
        public websocketService: WebsocketService,
        public notificationService: NotificationService
    ) {
        super(websocketService, notificationService);
    }

    ngAfterViewInit() {

        this.getRealtimeAvailableSteps();
        // this.appForm.formGroup.get('lat')?.valueChanges.subscribe(() => {
        //     this.formService.emitIfLonLatValid();
        // });

        // this.appForm.formGroup.get('lon')?.valueChanges.subscribe(() => {
        //     this.formService.emitIfLonLatValid();
        // });
        this._latSubscription = this.formService.currentForm.formGroup.get('lat')?.valueChanges.subscribe(() => {
            this.formService.emitIfLonLatValid();
        });

        this._lonSubscription = this.formService.currentForm.formGroup.get('lon')?.valueChanges.subscribe(() => {
            this.formService.emitIfLonLatValid();
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mapService.onClickInit();

        this.mapSubscription = this.mapService.mapSubject.subscribe(
            (cbrnMap: any) => {
                let marker = cbrnMap.marker;
                this.appForm.formGroup.patchValue({
                    lon: `${marker.lon}`,
                    lat: `${marker.lat}`,
                });
            }
        );
    }

    onSubmit() {
        const notifTitle = this.notificationService.addNotif('ATP45 Prediction', 'atp45Request');

        const atp45Input = {
            datetime: this.formService.removeTimeZone(this.appForm.form.get('startdate').value?.obj[0].datetime),
            lat: this.appForm.formGroup.get('lat')?.value,
            lon: this.appForm.formGroup.get('lon')?.value,
            step: this.appForm.formGroup.get('startdate')?.value.step,
            ws_info: { channel: this.websocketService.channel, backid: notifTitle },
        }

        const payload = {
            ...atp45Input,
            request: "realtime_prediction_request"
        }
        this.requestService.atp45Request(payload).subscribe({
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

    getRealtimeAvailableSteps() {
        const payload = { request: "realtime_available_steps" }
        this.requestService.atp45Request(payload).subscribe({
            next: (data: any) => {
                let steps = data;
                steps.forEach((element: any) => {
                    element.datetime = new Date(element.datetime);
                });

                // this.appForm.form.get("startdate").value = {
                //     obj: steps, 
                //     display: steps.map((e:any) => e.datetime),
                //     withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] }
                // }
                this.appForm.form.newDistVal('startdate', steps, steps.map((e: any) => e.datetime))
                this.appForm.formGroup.get('startdate')?.setValue(steps[0]);
            },
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();

        this._latSubscription?.unsubscribe();
        this._lonSubscription?.unsubscribe();
    }
}
