import { ShapeData } from './../../../../../interfaces/atp45/shape-data';
import { Forecast } from './../../../../../interfaces/forecast';
import { Form } from './../../../../../models/form';
import { FormItem } from './../../../../../interfaces/form-item';
import { GribData } from './../../../../../interfaces/atp45/grib-data';
import { Atp45RequestService } from '../../../../../services/atp45-request.service';
import { MapService } from '../../../../../services/map.service';
import { FormService } from '../../../../../services/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { Shape } from 'src/app/interfaces/atp45/shape-data';
import { formatDate } from '@angular/common';
import { Validators } from '@angular/forms';
import { wrongLatValidator, wrongLonValidator } from 'src/app/shared/validators';

@Component({
    selector: 'app-preloaded-form',
    templateUrl: './preloaded-form.component.html',
    styleUrls: ['./preloaded-form.component.scss']
})
export class PreloadedFormComponent implements OnInit, OnDestroy {
    // @Input() formItems: any;
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
            placeholder: <Forecast>{startdate: new Date, steps: []}
        },
    ]

    form: Form = new Form(this.formItems);

    @Input() selection: SelectionModel<GribData>;

    formGroup: FormGroup;
    mapSubscription: Subscription;
    // availableSteps: any;

    constructor(
        private formService: FormService,
        private mapService: MapService, 
        private atp45Service: Atp45RequestService) { }

    ngOnInit(): void {
        this.formGroup = this.formService.initForm(this.form)
        this.mapService.onClickInit();
        
        this.mapSubscription = this.mapService.mapSubject.subscribe(
            (cbrnMap: any) => {
                let marker = cbrnMap.marker;
                this.formGroup.patchValue({
                    lon: `${marker.lon}`,
                    lat: `${marker.lat}`
                });
            }
        );

        this.formGroup.get('lat')?.valueChanges.subscribe( () => {
            this.emitIfValid();
        });

        this.formGroup.get('lon')?.valueChanges.subscribe( () => {
            this.emitIfValid();
        });

        this.selection.changed.subscribe({
            next: (s) => {
                const newGribata = s.added[0];
                this.updateStepSelection(newGribata);
                this.mapService.cbrnMap.newAvailableArea(newGribata.area)
            }
        });

        this.formService.newCurrentForm(this.formGroup);
        
    }

    emitIfValid() {
        if (this.formGroup.get('lat')?.valid && this.formGroup.get('lon')?.valid) {
            this.formService.emitCurrentForm();
        }
    }

    updateStepSelection(gribData: GribData) {
        this.atp45Service.getAvailableSteps(gribData).subscribe(
            (data: any) => {
                let forecast = data;
                forecast.startdate = new Date(forecast.startdate)
                forecast.steps.forEach((element: {step: number, datetime: Date}) => {
                    element.datetime = new Date(element.datetime)
                });
                this.form.get('forecast').placeholder = <Forecast>forecast;
                this.formGroup.get('forecast')?.setValue(forecast.steps[0]);
            },
            (error: HttpErrorResponse) => {
                console.error(error.error);
            }
        )
    }

    onGetAtp45Prediction() {
        const date = this.form.get('forecast').placeholder.startdate;
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
          
        const atp45Input = {
            datetime: new Date(date.getTime() - userTimezoneOffset),
            lat: this.formGroup.get('lat')?.value,
            lon: this.formGroup.get('lon')?.value,
            step: this.formGroup.get('forecast')?.value.step,
            loaded_file: this.selection.selected[0].filename,
            area: this.selection.selected[0].area
        }

        this.atp45Service.getAtp45Prediction(atp45Input).subscribe({
            next: (shapeData: any) => {
                shapeData = this.formService.handlePredictionResponse(shapeData);
                this.mapService.cbrnMap.drawShapes(shapeData);
            },
            error: (error: HttpErrorResponse) => {
                alert(error.message);
            }
        })
    }

    ngOnDestroy() {
        this.mapSubscription.unsubscribe();
        this.mapService.offClickEvent();
    }

}
