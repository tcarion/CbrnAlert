import { FormComponent } from 'src/app/shared/form/form.component';
import { ApiService } from 'src/app/core/services/api.service';
import { AbstractFormComponent } from '../../../abstract-classes/abstract-form-component';
import { Forecast } from '../../../interfaces/forecast';
import { GribData } from '../../grib-data';
import { MapService } from 'src/app/core/services/map.service';
import { FormService } from 'src/app/core/services/form.service';
import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { Validators } from '@angular/forms';
import { wrongLatValidator, wrongLonValidator } from 'src/app/shared/validators';
import { DatePipe } from '@angular/common';
import { Atp45Service } from 'src/app/atp45/atp45.service';

@Component({
    selector: 'app-preloaded-form',
    templateUrl: './preloaded-form.component.html',
    styleUrls: ['./preloaded-form.component.scss']
})
export class PreloadedFormComponent extends AbstractFormComponent implements OnInit, OnDestroy, AfterViewInit {
    formItems: any = [
        {
            controlName: 'lat',
            label: 'Release latitude [°]',
            type: 'input',
            hint: '[-90.0°, 90.0°]',
            validators: [wrongLatValidator(), Validators.required]
        },
        {
            controlName: 'lon',
            label: 'Release longitude [°]',
            type: 'input',
            hint: '[-180°, 180°]',
            validators: [wrongLonValidator(), Validators.required]
        },
        {
            controlName: 'forecast',
            label: 'Forecast step selection: ',
            type: 'select',
            validators: [Validators.required],
            value: {
                obj: [],
                display: [],
                withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] }
            }
        },
    ]

    @Input() newSelectionSubject: Subject<GribData>;
    gribData: GribData;

    mapSubscription: Subscription;

    _latSubscription?: Subscription;
    _lonSubscription?: Subscription;

    newSelectionSubscription: Subscription;

    @ViewChild('appForm') appForm: FormComponent;

    constructor(
        public formService: FormService,
        private mapService: MapService, 
        private apiService: ApiService,
        private atp45Service: Atp45Service
        ) { 
            super(formService);
        }
    
    ngAfterViewInit() {
        this._latSubscription = this.formService.currentForm.formGroup.get('lat')?.valueChanges.subscribe(() => {
            this.formService.emitIfLonLatValid();
        });

        this._lonSubscription = this.formService.currentForm.formGroup.get('lon')?.valueChanges.subscribe(() => {
            this.formService.emitIfLonLatValid();
        });

        this.newSelectionSubscription = this.newSelectionSubject.subscribe((newGribata) => {
            this.updateStepSelection(newGribata);
            this.mapService.cbrnMap.newAvailableArea(newGribata.area);
            this.gribData = newGribata;
        });
    }

    ngOnInit(): void {
        super.ngOnInit()
        this.mapService.onClickInit();
        
        this.mapSubscription = this.mapService.mapSubject.subscribe(
            (cbrnMap: any) => {
                let marker = cbrnMap.marker;
                this.appForm.formGroup.patchValue({
                    lon: `${marker.lon}`,
                    lat: `${marker.lat}`
                });
            }
        );
    }

    emitIfValid() {
        if (this.appForm.formGroup.get('lat')?.valid && this.appForm.formGroup.get('lon')?.valid) {
            this.formService.emitCurrentForm();
        }
    }

    updateStepSelection(gribData: GribData) {
        const payload = {
            ...gribData,
            request: "available_steps"
        };

        this.apiService.atp45Request(payload).subscribe(
            (data: any) => {
                let forecast = data;
                forecast.startdate = new Date(forecast.startdate)
                forecast.steps.forEach((element: {step: number, datetime: Date}) => {
                    element.datetime = new Date(element.datetime)
                });
                
                this.appForm.form.get('forecast').value = {
                    ...this.appForm.form.get('forecast').value,
                    obj: forecast.steps.map((e:any) => {return e}),
                    display: forecast.steps.map((e:any) => {return e.datetime}),
                    metadata: <Forecast>forecast,
                }
                this.appForm.formGroup.get('forecast')?.setValue(forecast.steps[0]);
            },
            (error: HttpErrorResponse) => {
                console.error(error.error);
            }
        );
    }

    onSubmit() {
        // const date = this.appForm.form.get('forecast').placeholder.startdate;
        const date = this.appForm.form.get('forecast')?.value?.metadata.startdate;
          
        const atp45Input = {
            datetime:  this.formService.removeTimeZone(date),
            lat: this.appForm.formGroup.get('lat')?.value,
            lon: this.appForm.formGroup.get('lon')?.value,
            step: this.appForm.formGroup.get('forecast')?.value.step,
            loaded_file: this.gribData.filename,
            area: this.gribData.area
        };

        this.atp45Service.preloadedResultRequest(atp45Input);
        // const payload = {
        //     ...atp45Input,
        //     request: "prediction_request"
        // };
        // this.apiService.atp45Request(payload).subscribe({
        //     next: (shapeData: any) => {
        //         shapeData = this.formService.handlePredictionResponse(shapeData);
        //         this.mapService.cbrnMap.drawShapes(shapeData);
        //     },
        //     error: (error: HttpErrorResponse) => {
        //         alert(error.message);
        //     }
        // });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();
        this.mapService.cbrnMap.removeAvailableArea();
    }

}
