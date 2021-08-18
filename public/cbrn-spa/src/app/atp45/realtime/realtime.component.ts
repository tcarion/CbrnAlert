
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormService } from '../../core/services/form.service';
import { FormItem } from '../../core/models/form-item';
import { MapService } from 'src/app/core/services/map.service';
import {
    wrongLatValidator,
    wrongLonValidator,
} from 'src/app/shared/validators';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { DatePipe } from '@angular/common';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { TextFormItem } from 'src/app/shared/form/form-item-text';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItems } from 'src/app/shared/form/form-items';

const formItems: FormItemBase<String>[] = [
    new SelectFormItem({
        key: 'step',
        label: 'Forecast step selection',
        type: 'mapObject',
        required: true,
        autoSelect: true,
    }),
    new TextFormItem({
        key: 'lat',
        label: 'Release latitude [°]',
        type: 'mapObject',
        hint: '[-90.0°, 90.0°]',
        required: true,
        validators: [wrongLatValidator],
        mapper: (v: number) => (Math.round(v * 1000) / 1000).toString()
    }),
    new TextFormItem({
        key: 'lon',
        label: 'Release longitude [°]',
        type: 'mapObject',
        hint: '[-180°, 180°]',
        required: true,
        validators: [wrongLonValidator],
        mapper: (v: number) => (Math.round(v * 1000) / 1000).toString()
    }),
]
@Component({
    selector: 'app-realtime',
    templateUrl: './realtime.component.html',
    styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent extends AbstractWsComponent implements OnInit, OnDestroy, AfterViewInit {

    formItems = new FormItems(formItems);
    formGroup: FormGroup;

    lonlatGroup: FormGroup;
    // @ViewChild('appForm') appForm: FormComponent;

    mapSubscription: Subscription;

    // _latSubscription?: Subscription;
    // _lonSubscription?: Subscription;

    constructor(
        private mapService: MapService,
        public formService: FormService,
        public websocketService: WebsocketService,
        public notificationService: NotificationService,
        private atp45Service: Atp45Service,
    ) {
        super(websocketService, notificationService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mapService.onClickInit();

        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        this.mapSubscription = this.mapService.mapEventSubject.subscribe(
            (event) => {
                if (event == 'newMarker') {
                    let marker = this.mapService.cbrnMap.marker;
                    this.formService.patchMarker(this.formGroup, marker);
                }
            }
        );
    }

    ngAfterViewInit() {
        this.getRealtimeAvailableSteps();

        this.formService.lonlatValid(this.formGroup).subscribe(() => {
            this.mapService.cbrnMap.marker = this.formService.getLonlat(this.formGroup);
        })
    }


    onSubmit() {
        const startdate = this.formItems.get('step').options[0].object!.datetime;
          
        const atp45Input = {
            datetime:  this.formService.removeTimeZone(startdate),
            lat: this.formGroup.get('lat')?.value,
            lon: this.formGroup.get('lon')?.value,
            step: this.formGroup.get('step')?.value.step,
        };
        this.atp45Service.realtimeResultRequest(atp45Input);

    }

    getRealtimeAvailableSteps() {
        this.atp45Service.realtimeAvailableSteps().subscribe(
            (data) => {
                let steps = data as {step: number, datetime:any}[]
                let values = steps.map(step => this.formService.formatIfDate(step.datetime))
                this.formItems.get('step').options = this.formService.mapObjectToOptions(values, steps);
            }
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();
    }
}
