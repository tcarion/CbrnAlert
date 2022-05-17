import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/core/services/form.service';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItems } from 'src/app/shared/form/form-items';

const formItems: FormItemBase[] = [
    new SelectFormItem({
        key: 'step',
        label: 'Forecast step selection',
        type: 'mapObject',
        required: true,
        autoSelect: true,
        options: [
            {key: 0.01},
            {key: 0.1},
            {key: 1},
        ]
    }),
]

@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit {

    withWind: boolean = false;
    formGroup: FormGroup;
    formItems = new FormItems(formItems);

    constructor(
        public formService: FormService,
    ) { }

    ngOnInit(): void {
        this.formGroup = this.formService.toFormGroup(this.formItems.items);

    }

    onSubmit() {
        const formVals = this.formGroup.value;
        // this.atp45Service.realtimeResultRequest(atp45Input).subscribe(res => {
        //     this.store.dispatch(new MapPlotAction.Add(res, 'atp45'))
        // });
        console.log(formVals)
    }
    
}
