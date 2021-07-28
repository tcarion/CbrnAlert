import { Subscription, Subject } from 'rxjs';
import { FormItem } from '../../../core/models/form-item';
import { AroundPipe } from '../../../core/pipes/around.pipe';
import { DatePipe } from '@angular/common';
import { wrongLatValidator, wrongLonValidator } from 'src/app/shared/validators';
import { Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { FormService } from 'src/app/core/services/form.service';
import { ApiService } from 'src/app/core/services/api.service';
import { MapService } from 'src/app/core/services/map.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AbstractWsComponent } from 'src/app/abstract-classes/abstract-ws-component';
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { FlexpartService } from '../../flexpart.service';

@Component({
    selector: 'app-flexpart-run-preloaded-form',
    templateUrl: './flexpart-run-preloaded-form.component.html',
    styleUrls: ['./flexpart-run-preloaded-form.component.scss']
})
export class FlexpartRunPreloadedFormComponent extends AbstractWsComponent implements OnInit, OnDestroy {

    formItems: FormItem[] = [
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
        {
            controlName: 'startDate',
            label: 'Starting date',
            type: 'select',
            value: {
                obj: [],
                display: [],
                withPipe: {
                    pipe: DatePipe,
                    arg: ["YYYY-MM-dd @ HH:mm"]
                }
            },
            validators: [Validators.required],
        },
        {
            controlName: 'endDate',
            label: 'End date',
            type: 'select',
            value: {
                obj: [],
                display: [],
                withPipe: {
                    pipe: DatePipe,
                    arg: ["YYYY-MM-dd @ HH:mm"]
                }
            },
            validators: [Validators.required],
        },
        {
            controlName: 'releaseStartDate',
            label: 'Release Start Date',
            type: 'select',
            value: {
                obj: [],
                display: [],
                withPipe: {
                    pipe: DatePipe,
                    arg: ["YYYY-MM-dd @ HH:mm"]
                }
            },
            validators: [Validators.required],
        },
        {
            controlName: 'releaseEndDate',
            label: 'Release End Date',
            type: 'select',
            value: {
                obj: [],
                display: [],
                withPipe: {
                    pipe: DatePipe,
                    arg: ["YYYY-MM-dd @ HH:mm"]
                }
            },
            validators: [Validators.required],
        },
        {
            controlName: 'releaseHeight',
            label: 'Release Height [m]',
            type: 'input',
            value: {
                obj: "50",
                display: "50",
            },
            validators: [Validators.required],
        },
        {
            controlName: 'particulesNumber',
            label: 'Nbr of particules',
            type: 'input',
            value: {
                obj: "1000",
                display: "1000",
            },
            validators: [Validators.required],
        },
        {
            controlName: 'mass',
            label: 'Particules mass [kg]',
            type: 'input',
            value: {
                obj: '1.0',
                display: '1.0',
            },
            validators: [Validators.required],
        },
        {
            controlName: 'gridRes',
            label: 'Grid res. [°]',
            type: 'select',
            value: {
                obj: [0.1, 0.2, 0.5, 1., 2.],
                display: [0.1, 0.2, 0.5, 1., 2.]
            },
            validators: [Validators.required],
        },
        {
            controlName: 'timeStep',
            label: 'Time step [h]',
            type: 'select',
            value: {
                obj: [1, 3, 6],
                display: [1, 3, 6],
            },
            validators: [Validators.required],
        },
        {
            controlName: 'area',
            label: 'Area to retrieve',
            type: 'input',
            value: {
                obj: [],
                display: [],
                withPipe: { pipe: AroundPipe }
            },
            validators: [Validators.required],
        },
    ];

    @Input() newSelectionSubject: Subject<FlexpartInput>;
    flexpartInput: FlexpartInput;

    mapSubscription: Subscription;

    _latSubscription?: Subscription;
    _lonSubscription?: Subscription;

    newSelectionSubscription: Subscription;

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

        this.mapService.cbrnMap.addDrawControl();
        this.mapService.onAreaSelectionInit();

        this.mapSubscription = this.mapService.mapEventSubject.subscribe({
            next: (event) => {
                if (event == 'areaSelection') {
                    let area = this.mapService.cbrnMap.layerToArea(this.mapService.cbrnMap.areaSelection);
                    this.formService.currentForm.form.newVal('area', area);
                }

                if (event == 'newMarker') {
                    let marker = this.mapService.cbrnMap.marker;
                    marker !== undefined && this.formService.currentForm.formGroup.patchValue({
                        lon: `${marker.lon}`,
                        lat: `${marker.lat}`,
                    });
                }
            }
        });
    }

    ngAfterViewInit() {
        this.formService.currentForm.formGroup.get('area')?.disable();

        this._latSubscription = this.formService.currentForm.formGroup.get('lat')?.valueChanges.subscribe(() => {
            this.formService.emitIfLonLatValid();
        });

        this._lonSubscription = this.formService.currentForm.formGroup.get('lon')?.valueChanges.subscribe(() => {
            this.formService.emitIfLonLatValid();
        });

        this.newSelectionSubscription = this.newSelectionSubject.subscribe((fpInput) => {
            console.log(fpInput);
            this.updateForm(fpInput);
            this.flexpartInput = fpInput;
        });
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
            this.formService.currentForm.form.newVal(e, available_dates);
            this.formService.currentForm.formGroup.get(e)?.patchValue(available_dates[0]);
        })
        this.mapService.cbrnMap.newAvailableArea(fpInput.area);
    }

    onSubmit(): void {

        let formFields = this.formService.formToObject();
        formFields = {
            ...formFields,
            dataDirname: this.flexpartInput.dataDirname,
        }
        console.log(formFields);

        this.flexpartService.runFlexpart(formFields);
        
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.mapService.cbrnMap.removeDrawControl();
        this.mapService.cbrnMap.removeLayer(this.mapService.cbrnMap.areaSelection);
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();

        this._latSubscription?.unsubscribe();
        this._lonSubscription?.unsubscribe();

        this.newSelectionSubscription.unsubscribe();
    }

}
