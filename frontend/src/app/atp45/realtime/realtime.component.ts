
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
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { DatePipe } from '@angular/common';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { TextFormItem } from 'src/app/shared/form/form-item-text';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItems } from 'src/app/shared/form/form-items';
import { Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/map-plot.state';


const formItems: FormItemBase[] = [
    new SelectFormItem({
        key: 'step',
        label: 'Forecast step selection',
        type: 'mapObject',
        required: true,
        autoSelect: true,
    }),
    // new TextFormItem({
    //     key: 'lat',
    //     label: 'Release latitude [°]',
    //     type: 'mapObject',
    //     hint: '[-90.0°, 90.0°]',
    //     required: true,
    //     validators: [wrongLatValidator],
    //     mapper: (v: string) => (Math.round(parseFloat(v) * 1000) / 1000).toString()
    // }),
    // new TextFormItem({
    //     key: 'lon',
    //     value: '8.0',
    //     label: 'Release longitude [°]',
    //     type: 'mapObject',
    //     hint: '[-180°, 180°]',
    //     required: true,
    //     validators: [wrongLonValidator],
    //     mapper: (v: string) => (Math.round(parseFloat(v) * 1000) / 1000).toString()
    // }),
]
@Component({
    selector: 'app-realtime',
    templateUrl: './realtime.component.html',
    styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent extends AbstractWsComponent implements OnInit, OnDestroy, AfterViewInit {
    latItem = new TextFormItem({
        key: 'lat',
        label: 'Release latitude [°]',
        type: 'mapObject',
        hint: '[-90.0°, 90.0°]',
        required: true,
        mapper: (v: string) => (Math.round(parseFloat(v) * 1000) / 1000).toString()
    })

    lonItem = new TextFormItem({
        key: 'lon',
        value: '8.0',
        label: 'Release longitude [°]',
        type: 'mapObject',
        hint: '[-180°, 180°]',
        required: true,
        mapper: (v: string) => (Math.round(parseFloat(v) * 1000) / 1000).toString()
    })

    formItems = new FormItems(formItems);
    formGroup: FormGroup;

    lonlatFormArray: FormArray;
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
        private store: Store,
    ) {
        super(websocketService, notificationService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mapService.onClickInit();

        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        this.formGroup.addControl('lonlats', this.formService.lonlatControlArray());

        this.mapSubscription = this.mapService.mapEventSubject.subscribe(
            (event) => {
                if (event == 'newMarker') {
                    let marker = this.mapService.cbrnMap.marker;
                    this.formService.patchMarker((this.formGroup.get('lonlats') as FormGroup).controls[0] as FormGroup, marker);
                }
            }
        );
    }

    ngAfterViewInit() {
        this.getRealtimeAvailableSteps();

        this.formService.lonlatValid2(this.lonlats.controls[0] as FormGroup).subscribe()
    }

    get lonlats() {
        return this.formGroup.get('lonlats') as FormArray;
    }

    getArrayElem(i: number) {
        return this.lonlats.controls[i] as FormGroup
    }

    onSubmit() {
        const startdate = this.formItems.get('step').options[0].object!.datetime;
        const lonlat = this.formService.getLonlat(this.getArrayElem(0))
        const atp45Input = {
            datetime: this.formService.removeTimeZone(startdate),
            ...lonlat,
            step: this.formGroup.get('step')?.value.step,
        };
        this.atp45Service.realtimeResultRequest(atp45Input).subscribe(res => {
            this.store.dispatch(new MapPlotAction.Add(res, 'atp45'))
        });

    }

    getRealtimeAvailableSteps() {
        this.atp45Service.realtimeAvailableSteps().subscribe(
            (data) => {
                let steps = data as { step: number, datetime: any }[]
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
