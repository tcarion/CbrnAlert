import { WindAtp45Input } from './../../core/api/models/wind-atp-45-input';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/api/services';
import { FormService } from 'src/app/core/services/form.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItems } from 'src/app/shared/form/form-items';
import { ForecastStartAction } from 'src/app/core/state/atp45.state';
import { ThrowStmt } from '@angular/compiler';

const formItems: FormItemBase[] = [
    new SelectFormItem({
        key: 'datetime',
        label: 'Forecast step selection',
        type: 'mapObject',
        required: true,
        autoSelect: true,
        options: [
            {key: "2022-05-17T18:80:00Z"},
            {key: 0.1},
            {key: 1},
        ]
    }),
]

class _WindAtp45Input {
    public constructor(init?: Partial<WindAtp45Input>) {
          Object.assign(this, init);
      }
  }
@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit {

    withWind: boolean = false;
    formGroup: FormGroup;
    leadtimes$ = new BehaviorSubject<string[]>(["empty"]);

    types: string[];

    constructor(
        public formService: FormService,
        public apiService: ApiService,
        public store: Store
    ) { 
    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({});
        this.apiService.forecastAvailableGet().subscribe(res => {
            this.store.dispatch(new ForecastStartAction.Update(res));
            this.leadtimes$.next(res.leadtimes)
        })

        this.apiService.atp45TypesGet().subscribe(res => {
            this.types = res;
        })
    }

    onSubmit() {
        let formVals = this.formGroup.value;
        if (this.withWind) {
            // TODO : Casting the form result to the types of interface. https://stackoverflow.com/questions/44708240/mapping-formgroup-to-interface-object
            let payload = {...formVals}
            console.log(payload)
            this.apiService.atp45RunWindPost({body: payload}).subscribe(res => {
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
            this.apiService.atp45RunForecastPost({body: formVals}).subscribe(res => {
                console.log(res)
            })    
        }
        console.log("Form sent from ATP45 run: %o", formVals)
    }
    
}
