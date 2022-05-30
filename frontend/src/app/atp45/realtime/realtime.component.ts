
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormService } from '../../core/services/form.service';
import { MapService } from 'src/app/core/services/map.service';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Atp45Service } from 'src/app/atp45/atp45.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
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
]
@Component({
    selector: 'app-realtime',
    templateUrl: './realtime.component.html',
    styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent implements OnInit, OnDestroy, AfterViewInit {
    // latItem = new TextFormItem({
    //     key: 'lat',
    //     label: 'Release latitude [°]',
    //     type: 'mapObject',
    //     hint: '[-90.0°, 90.0°]',
    //     required: true,
    //     mapper: (v: string) => (Math.round(parseFloat(v) * 1000) / 1000).toString()
    // })

    // lonItem = new TextFormItem({
    //     key: 'lon',
    //     value: '8.0',
    //     label: 'Release longitude [°]',
    //     type: 'mapObject',
    //     hint: '[-180°, 180°]',
    //     required: true,
    //     mapper: (v: string) => (Math.round(parseFloat(v) * 1000) / 1000).toString()
    // })

    formItems = new FormItems(formItems);
    formGroup: FormGroup;

    // lonlatFormArray: FormArray;
    // @ViewChild('appForm') appForm: FormComponent;

    // mapSubscription: Subscription;

    // _latSubscription?: Subscription;
    // _lonSubscription?: Subscription;

    constructor(
        private mapService: MapService,
        public formService: FormService,
        public notificationService: NotificationService,
        private atp45Service: Atp45Service,
        private store: Store,
    ) {
    }

    ngOnInit(): void {
        this.formGroup = this.formService.toFormGroup(this.formItems.items);
    }

    ngAfterViewInit() {
        this.getRealtimeAvailableSteps();

    }

    onSubmit() {
        const startdate = this.formItems.get('step').options[0].object!.datetime;
        const formVals = this.formGroup.value;
        // const lonlat = this.formService.getLonlat(this.getArrayElem(0))
        // const atp45Input = {
        //     datetime: this.formService.removeTimeZone(startdate),
        //     // ...lonlat,
        //     step: this.formGroup.get('step')?.value.step,
        // };
        const atp45Input = {
            ...formVals,
            datetime: this.formService.removeTimeZone(startdate),
            // step: this.formGroup.get('step')?.value.step,
        };
        this.atp45Service.realtimeResultRequest(atp45Input).subscribe(res => {
            // this.store.dispatch(new MapPlotAction.Add(res, 'atp45'))
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
        // this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();
    }
}
