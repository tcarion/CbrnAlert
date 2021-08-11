import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FlexpartResult } from 'src/app/flexpart/flexpart-result';
// import { FormItem } from 'src/app/core/models/form-item';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/core/services/api.service';
import { MapService } from 'src/app/core/services/map.service';
import { FormService } from 'src/app/core/services/form.service';
import { FlexpartService } from '../../flexpart.service';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItemBase } from 'src/app/shared/form/form-item-base';

// const formItems: FormItem[] = [
//     {
//         controlName: 'variables',
//         label: 'Variables',
//         type: 'select',
//         validators: [Validators.required]
//     },
//     {
//         controlName: 'timeSteps',
//         label: 'Date to plot',
//         type: 'select',
//         validators: [Validators.required],
//         value: {
//             obj: [],
//             display: [],
//             withPipe: { pipe: DatePipe, arg: ["YYYY-MM-dd @ HH:mm"] }
//         }
//     },
//     {
//         controlName: 'heights',
//         label: 'Height',
//         type: 'select',
//         validators: [Validators.required]
//     },
// ]
// interface formItem {
//     key: string, 
//     label: string, 
//     required?: boolean, 
//     options: any,
//     value?: string|undefined,
// }

// const formItems: formItem[] = [{
//     key: 'variables',
//     label: 'Variables',
//     options: [],
//     required: true,
// }]

const formItems = [
    new SelectFormItem({
        key: 'variables',
        label: 'Variables',
        options: [],
        required: true,
    }),
]
@Component({
    selector: 'app-flexpart-plot-form',
    templateUrl: './flexpart-plot-form.component.html',
    styleUrls: ['./flexpart-plot-form.component.scss']
})
export class FlexpartPlotFormComponent implements OnInit, OnDestroy {
    formItems;
    nestedItems: FormItemBase<String>[] = [];

    formGroup: FormGroup;

    @Input() newSelectionSubject: Subject<FlexpartResult>;

    flexpartResult: FlexpartResult;
    variables = [];
    selectedVar: { [key: string]: (string | number | Date)[] };

    mapSubscription: Subscription;
    newSelectionSubscription: Subscription;

    constructor(
        private mapService: MapService,
        private flexpartService: FlexpartService,
        public formService: FormService,
        private formBuilder: FormBuilder,
    ) {
        this.formItems = formItems;
    }

    ngOnInit(): void {
        this.formGroup = this.formService.toFormGroup(formItems);

        this.formGroup.controls.variables.valueChanges.subscribe((value) => {
            this.nestedItems = [];
            const dims = this.variables[value];
            // this.selectedVar = dims;
            for (const [key, value] of Object.entries(dims)) {
                this.nestedItems.push(new SelectFormItem({
                    key: key,
                    label: key,
                    options: (value as Array<string>).map((e) => { return {key: e} }),
                    required: true,
                }))
            }
            // this.formGroup = this.formService.toFormGroup(formItems);
            // this.formGroup = this.formBuilder.group({
            //     ...this.formGroup.controls,
            //     ...this.newControls
            // });
        })

    }

    // addControls(keys: string[]) {
    //     const group: any = {};
    //     for (const key of keys) {
    //         // this.formGroup.addControl(key, new FormControl('', Validators.required));
    //         // group[key] = new FormControl('', Validators.required);
    //         this.dimensions.addControl(key, new FormControl('', Validators.required));
    //     }
    //     // this.newControls = group;
    // }

    ngAfterViewInit() {
        this.newSelectionSubscription = this.newSelectionSubject.subscribe((fpResult) => {
            this.mapService.cbrnMap.newAvailableArea(fpResult.area);
            this.flexpartResult = fpResult;
            this.variables = fpResult.variables2d;
            this.formItems.forEach((item) => {
                item.options = item.key == 'variables' ? this.formService.arrayToOptions(Object.keys(fpResult.variables2d)) : []
            })
        });
    }

    varNames() {
        return Object.keys(this.variables)
    }

    onSubmit() {
        let formFields = this.formService.formToObject();
        formFields = {
            ...formFields,
            dataDirname: this.flexpartResult.dataDirname,
            flexpartResult: this.flexpartResult,
        }

        this.flexpartService.newPlot(formFields);
    }

    ngOnDestroy() {
        this.newSelectionSubject.unsubscribe();
    }

}
