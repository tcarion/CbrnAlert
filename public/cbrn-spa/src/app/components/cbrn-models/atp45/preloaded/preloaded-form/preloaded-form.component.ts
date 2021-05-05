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
            controlName: 'datetime',
            label: 'Forecast step selection: ',
            type: 'select',
            validators: [Validators.required]
        },
    ]
    @Input() selection: SelectionModel<GribData>;

    preloadedForm: FormGroup = this.formbuilder.group({});
    mapSubscription: Subscription;
    // availableSteps: any;

    constructor(
        private formbuilder: FormBuilder, 
        private formService: FormService,
        private mapService: MapService, 
        private atp45Service: Atp45RequestService) { }

    ngOnInit(): void {
        this.initForm();

        this.mapSubscription = this.mapService.mapSubject.subscribe(
            (cbrnMap: any) => {
                let marker = cbrnMap.marker;
                this.preloadedForm.patchValue({
                    lon: `${marker.lon}`,
                    lat: `${marker.lat}`
                });
            }
        )

        this.preloadedForm.get('lat')?.valueChanges.subscribe( () => {
            this.emitIfValid();
        })

        this.preloadedForm.get('lon')?.valueChanges.subscribe( () => {
            this.emitIfValid();
        })

        this.selection.changed.subscribe({
            next: (s) => {
                const newGribata = s.added[0];
                this.updateStepSelection(newGribata);
                this.mapService.cbrnMap.newAvailableArea(newGribata.area)
            }
        })

        this.formService.newCurrentForm(this.preloadedForm);
        
    }

    initForm() {
        let formControls: {[k: string]: any} = {};
        this.formItems.forEach((formItem: FormItem) => {
            let validators = formItem.validators === undefined ? [] : formItem.validators
            formControls[formItem.controlName] = [formItem.placeholder === undefined ? '' : formItem.placeholder, validators]
        });
        this.preloadedForm = this.formbuilder.group(formControls);
    }

    emitIfValid() {
        if (this.preloadedForm.get('lat')?.valid && this.preloadedForm.get('lon')?.valid) {
            this.formService.emitCurrentForm();
        }
    }

    updateStepSelection(gribData: GribData) {
        this.atp45Service.getAvailableSteps(gribData).subscribe(
            (data: any) => {
                let steps = data;
                steps.forEach((element: any) => {
                    element.datetime = new Date(element.datetime)
                });
                this.formItems.forEach((element: FormItem, index: number) => {
                    if(element.controlName === 'datetime') {
                        this.formItems[index].placeholder = steps;
                    }
                });
                this.preloadedForm.get('datetime')?.setValue(steps[0]);
            },
            (error: HttpErrorResponse) => {
                console.error(error.error);
            }
        )
    }

    onGetAtp45Prediction() {
        const date = this.selection.selected[0].startdate;
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
          
        const atp45Input = {
            datetime: new Date(date.getTime() - userTimezoneOffset),
            lat: this.preloadedForm.get('lat')?.value,
            lon: this.preloadedForm.get('lon')?.value,
            step: this.preloadedForm.get('datetime')?.value.step,
            loaded_file: this.selection.selected[0].filename,
            area: this.selection.selected[0].area
        }
        const runDate = this.preloadedForm.get('datetime')?.value.datetime;

        this.atp45Service.getAtp45Prediction(atp45Input).subscribe({
            next: (shapeData: any) => {
                let shapes = shapeData.shapes;
                let speed = Math.round(shapeData.wind.speed * 3.6 * 10) / 10;
                shapes.forEach((shape: Shape, i: number) => {
                    shape.coords = shape.lon.map((l, i) => [shape.lat[i], l]);
                    shape.text =
                        `<b>${shape.label}</b><br>
                        <b>Coordinates : (${atp45Input.lat}, ${atp45Input.lon})</b><br>
                        wind speed = ${speed} km/h<br>
                        date = ${formatDate(runDate, 'yyyy-MM-dd', "en-US")}<br>
                        time = ${formatDate(runDate, 'HH:mm', "en-US")}<br>
                        step = ${atp45Input.step}`;
                });
                this.mapService.cbrnMap.drawShapes(shapeData);
            },
            error: (error: HttpErrorResponse) => {
                alert(error.message);
            }
        })
    }

    ngOnDestroy() {
        this.mapSubscription.unsubscribe();
    }

}
