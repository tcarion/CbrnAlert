import { WindAtp45Input } from './../../core/api/models/wind-atp-45-input';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
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
import { tap, map } from 'rxjs/operators';
import { Validators } from '@angular/forms';

interface Atp45RunForm {
    locations: GeoPoint[]
    wind?: object
    leadtime?: object
}
@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit {

    withWind: boolean = true;
    // formGroup: FormGroup<any> = new FormGroup({location: new FormControl<GeoPoint>({lon: 0, lat: 0})});
    runForm = new FormGroup<any>({})
    // locationsControls: FormArray<GeoPoint, FormControl<GeoPoint>>;
    // locationsControls: FormArray<GeoPoint, FormControl<GeoPoint>> = new FormArray([new FormControl<GeoPoint>({lon: 0, lat: 0})])

    leadtimes$: Observable<string[]>;
    cbrn_types: string[];

    constructor(
        public formService: FormService,
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
        // this.apiService.atp45TypesGet().subscribe(res => {
        //     this.cbrn_types = res;
        // })
    }


    onSubmit() {
        let formVals = this.runForm.value as any;
        if (this.withWind) {
            // TODO : Casting the form result to the types of interface. https://stackoverflow.com/questions/44708240/mapping-formgroup-to-interface-object
            let payload = {...formVals}
            console.log(payload)
            this.apiService.atp45RunWindPost({body: payload as WindAtp45Input}).subscribe(res => {
                console.log(res)
            })    
        } else {
            formVals = {
                ...formVals,
                step: {
                    leadtime: formVals.leadtime,
                    start: <string> this.store.selectSnapshot(state => state.atp45.forecastStart)
                }
            }
            this.apiService.atp45RunForecastPost({body: formVals as ForecastAtp45Input}).subscribe(res => {
                console.log(res)
            })    
        }
        // let windinput = formVals
        console.log("Form sent from ATP45 run: %o", formVals)
    }
    
}
