import { FormItems } from 'src/app/shared/form/form-items';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { Subscription, Subject } from 'rxjs';
import { FormItem } from '../../../core/models/form-item';
import { AroundPipe } from '../../../core/pipes/around.pipe';
import { DatePipe } from '@angular/common';
import { wrongLatValidator, wrongLonValidator } from 'src/app/shared/validators';
import { Validators, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { FormService } from 'src/app/core/services/form.service';
import { ApiService } from 'src/app/core/services/api.service';
import { MapService } from 'src/app/core/services/map.service';
import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { FlexpartService } from '../../flexpart.service';
import { TextFormItem } from 'src/app/shared/form/form-item-text';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';

const formItems: FormItemBase[] = [
    new TextFormItem({
        key: 'lat',
        label: 'Release latitude [°]',
        type: 'input',
        hint: '[-90.0°, 90.0°]',
        required: true,
        validators: [wrongLatValidator]
    }),
    new TextFormItem({
        key: 'lon',
        label: 'Release longitude [°]',
        type: 'input',
        hint: '[-180°, 180°]',
        required: true,
        validators: [wrongLonValidator]
    }),
    new SelectFormItem({
        key: 'startDate',
        label: 'Starting date',
        type: 'mapObject',
        required: true,
        autoSelect: true,
    }),
    new SelectFormItem({
        key: 'endDate',
        label: 'End date',
        type: 'mapObject',
        required: true,
        autoSelect: true,
    }),
    new SelectFormItem({
        key: 'releaseStartDate',
        label: 'Release Start Date',
        type: 'mapObject',
        required: true,
        autoSelect: true,
    }),
    new SelectFormItem({
        key: 'releaseEndDate',
        label: 'Release End Date',
        type: 'mapObject',
        required: true,
        autoSelect: true,
    }),
    new TextFormItem({
        key: 'releaseHeight',
        label: 'Release Height [m]',
        type: 'input',
        required: true,
        value: "50",
    }),
    new TextFormItem({
        key: 'particulesNumber',
        label: 'Nbr of particules',
        type: 'input',
        required: true,
        value: "1000",
    }),
    new TextFormItem({
        key: 'mass',
        label: 'Released mass [kg]',
        type: 'input',
        required: true,
        value: "1.0",
    }),
    new SelectFormItem({
        key: 'gridRes',
        label: 'Grid res. [°]',
        required: true,
        autoSelect: true,
        options: [
            {key: 0.01},
            {key: 0.1},
            {key: 1},
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
    selector: 'app-flexpart-run-preloaded-form',
    templateUrl: './flexpart-run-preloaded-form.component.html',
    styleUrls: ['./flexpart-run-preloaded-form.component.scss']
})
export class FlexpartRunPreloadedFormComponent extends AbstractWsComponent implements OnInit, OnChanges, OnDestroy {

    formItems = new FormItems(formItems);

    @Input() flexpartInput: FlexpartInput;

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

    ngOnInit(): void {
        super.ngOnInit();
        this.mapService.onClickInit();

        this.mapService.addDrawControl();
        this.mapService.onAreaSelectionInit();

        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        this.mapSubscription = this.mapService.mapEventSubject.subscribe({
            next: (event) => {
                if (event == 'areaSelection') {
                    let area = this.mapService.cbrnMap.layerToArea(this.mapService.cbrnMap.areaSelection);
                    this.formGroup.get('area')?.patchValue(area);
                }

                if (event == 'newMarker') {
                    let marker = this.mapService.cbrnMap.marker;
                    this.formService.patchMarker(this.formGroup, marker);
                }
            }
        });
    }

    ngAfterViewInit() {
        this.formService.lonlatValid(this.formGroup).subscribe(() => {
            this.mapService.cbrnMap.marker = this.formService.getLonlat(this.formGroup);
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.flexpartInput && changes.flexpartInput.currentValue) {
            const fpInput = changes.flexpartInput.currentValue;

            console.log(fpInput);
            this.mapService.cbrnMap.newAvailableArea(fpInput.area);

            this.updateForm(fpInput);
        }
    }

    updateForm(fpInput: FlexpartInput) {
        const startDate = fpInput.startDate;
        const endDate = fpInput.endDate;
        const step = fpInput.timeStep;
        const hour_span = (endDate.getTime() - startDate.getTime()) / 36e5;
        let available_dates: Date[] = [startDate];
        for (let i = step; i <= hour_span; i = i + step) {
            available_dates.push(new Date(startDate.getTime() + i * 36e5));
        }
        ['startDate', 'endDate', 'releaseStartDate', 'releaseEndDate'].map((e) => {
            this.formItems.get(e).options = this.formService.mapObjectToOptions(
                available_dates.map(e => this.formService.formatIfDate(e)),
                available_dates)
        })
    }

    onSubmit(): void {

        let formFields = this.formGroup.value;
        formFields = {
            ...formFields,
            name: this.flexpartInput.name,
        }
        this.formService.adjustDates(formFields)
        console.log(formFields);

        this.flexpartService.runFlexpart(formFields);
        
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();
    }

}
