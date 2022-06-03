import { Atp45Result } from './../../core/api/models/atp-45-result';
import { WindAtp45Input } from './../../core/api/models/wind-atp-45-input';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
// import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/services';
import { FormService } from 'src/app/core/services/form.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItems } from 'src/app/shared/form/form-items';
import { ForecastStartAction } from 'src/app/core/state/atp45.state';
import { ControlsOf, FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ForecastAtp45Input, GeoPoint } from 'src/app/core/api/models';
import { tap, map, take } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { AppForms } from '../formtypes/atp45-input';
import { NgFormsManager } from '@ngneat/forms-manager';
import { ProcedureType } from 'src/app/core/api/models/procedure-type';
import { CbrnContainer } from 'src/app/core/api/models/cbrn-container';
import { MapPlotAction } from 'src/app/core/state/map-plot.state';

interface Atp45RunForm {
    locations: GeoPoint[]
    wind?: object
    leadtime?: object
}
const types = [
  {
    longName: 'FOO'
  },
  {
    longName: 'BAR'
  }
]
@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})

export class RunComponent implements OnInit {

    withWind: boolean = true;
    // formGroup: FormGroup<any> = new FormGroup({location: new FormControl<GeoPoint>({lon: 0, lat: 0})});
    runForm = new FormGroup<any>({
      'procedureTypeId': new FormControl(''),
      'containerId': new FormControl(''),
    })
    // locationsControls: FormArray<GeoPoint, FormControl<GeoPoint>>;
    // locationsControls: FormArray<GeoPoint, FormControl<GeoPoint>> = new FormArray([new FormControl<GeoPoint>({lon: 0, lat: 0})])

    leadtimes$: Observable<string[]>;
    procedureTypes$: Observable<ProcedureType[]>;
    containers$: Observable<CbrnContainer[]>;


    constructor(
        public formService: FormService,
        private formsManager: NgFormsManager<AppForms>,
        public apiService: ApiService,
        public store: Store
    ) {
        // this.runForm = new FormGroup({})
    }

    ngOnInit(): void {
        // const initLoc = new FormControl<GeoPoint>({lon: 0, lat: 0})
        // this.formGroup = new FormGroup({'locations': this.locationsControls})
        // this.formGroup = new FormGroup<ControlsOf<Atp45RunForm>>({
        //     locations: new FormArray<GeoPoint>([new FormControl<GeoPoint>({lon:0, lat:0})])
        // });
        this.leadtimes$ = this.apiService.forecastAvailableGet().pipe(
            map(res => {
            this.store.dispatch(new ForecastStartAction.Update(res));
            return res.leadtimes;
        }))
        this.procedureTypes$ = this.apiService.atp45ProceduresGet();
        this.containers$ = this.apiService.atp45ContainersGet();

        // Set the first value for the select controls:
        this.procedureTypes$.pipe(
          take(1)
        ).subscribe(val => this.runForm.patchValue({procedureTypeId: val[0].id}))
        this.containers$.pipe(
          take(1)
        ).subscribe(val => this.runForm.patchValue({containerId: val[0].id}))

        this.formsManager.upsert('atp45Input', this.runForm)
        // this.cbrnTypes$ = of(types);
    }


    onSubmit() {
        let formVals = this.runForm.value as any;
        let request;
        if (this.withWind) {
            // TODO : Casting the form result to the types of interface. https://stackoverflow.com/questions/44708240/mapping-formgroup-to-interface-object
            // let payload = {...formVals}
            // console.log(payload)
            request = this.apiService.atp45RunWindPost({body: formVals as WindAtp45Input})
        } else {
            formVals = {
                ...formVals,
                step: {
                    leadtime: formVals.leadtime,
                    start: <string> this.store.selectSnapshot(state => state.atp45.forecastStart)
                }
            }
            request = this.apiService.atp45RunForecastPost({body: formVals as ForecastAtp45Input})
        }
        // let windinput = formVals
        console.log("Form sent from ATP45 run: %o", formVals)

        request.subscribe(res => {
          this.store.dispatch(new MapPlotAction.Add(res, 'atp45'))
        })
    }

}
