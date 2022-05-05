import { FormItems } from 'src/app/shared/form/form-items';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
// import { FormItem } from 'src/app/core/models/form-item';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/core/services/api.service';
import { MapService } from 'src/app/core/services/map.service';
import { FormService } from 'src/app/core/services/form.service';
import { FlexpartService } from '../../flexpart.service';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { FlexpartOutput } from '../../flexpart-output';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MapPlotAction } from 'src/app/core/state/actions/map-plot.actions';
import { FlexpartOutputAction } from 'src/app/core/state/actions/flexpart-output.actions';

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

// const formItems = [
//     new SelectFormItem({
//         key: 'variables',
//         label: 'Variables',
//         options: [],
//         required: true,
//     }),
// ]
@Component({
    selector: 'app-output-form',
    templateUrl: './output-form.component.html',
    styleUrls: ['./output-form.component.scss']
})
export class OutputFormComponent implements OnInit, OnChanges {
    // formItems = new FormItems(formItems);

    formItems = new FormItems([]);

    formGroup: FormGroup;

    @Input() fpOutput: FlexpartOutput;
    @Input() selectedVar: string;
    // flexpartResult: FlexpartResult;
    // variables = [];
    // selectedVar: { [key: string]: (string | number | Date)[] };


    constructor(
        private mapService: MapService,
        private flexpartService: FlexpartService,
        public formService: FormService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store,
    ) {
        // const fpOutput = this.router.getCurrentNavigation()?.extras.state?.fpOutput; 
        // if (fpOutput) {
        //     this.fpOutput = fpOutput;
        // } else {
        //     this.router.navigate(['flexpart', 'results', this.route.snapshot.params['fpResultId']])
        // }
        // this.route.data.subscribe(data => {
        //     this.fpOutput = data.fpOutput;
        //     this.store.dispatch(new FlexpartOutputAction.Add(this.fpOutput));
        // })
    }

    ngOnInit(): void {
        // this.updateForm();
        // this.mapService.cbrnMap.newAvailableArea(this.fpOutput.area);
        // this.variables = this.fpOutput.variables2d;
        // this.formItems.get('variables').options = this.formService.arrayToOptions(this.fpOutput.variables2d)
        // this.variables = this.flexpartResult.variables2d;
        // this.formItems.forEach((item) => {
        //     item.options = item.key == 'variables' ? this.formService.arrayToOptions(Object.keys(this.flexpartResult.variables2d)) : []
        // })

        // this.formGroup.controls.variables.valueChanges.subscribe((value) => {
            
        //     this.nestedItems.forEach((item) => {
        //         this.formGroup.removeControl(item.key);
        //         this.formGroup.updateValueAndValidity();
        //     })

        //     this.nestedItems = [];

        //     const dims = this.variables[value];
        //     for (const [key, value] of Object.entries(dims)) {
        //         const newItem = new SelectFormItem({
        //             key: key,
        //             label: key,
        //             options: value ? this.formService.arrayToOptions(value as Array<string | number | Date>) : [],
        //             required: true,
        //             autoSelect: true,
        //             // type: 'mapObject',
        //         });
        //         this.formGroup.addControl(key, this.formService.toControl(newItem));
        //         this.nestedItems.push(newItem);
        //     }
        // })

    }

    updateForm() {
        this.formGroup = this.formService.toFormGroup(this.formItems.items);

        const dims = this.fpOutput.dimensions[this.selectedVar];
        for (const [key, value] of Object.entries(dims)) {
            const newItem = new SelectFormItem({
                key: key,
                label: key,
                options: value ? this.formService.arrayToOptions(value as Array<string | number | Date>) : [],
                required: true,
                autoSelect: true,
                // type: 'mapObject',
            });
            this.formGroup.addControl(key, this.formService.toControl(newItem));
            this.formItems.items.push(newItem);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedVar) {
            this.formItems = new FormItems([]);
            
            this.formItems.items.forEach((item) => {
                this.formGroup.removeControl(item.key);
                // this.formGroup.updateValueAndValidity();
            })
            this.updateForm();
        }
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes.flexpartOutput) {
    //         this.nestedItems = [];
    //         const flexpartOutput = changes.flexpartOutput.currentValue;
    
    //         this.mapService.cbrnMap.newAvailableArea(flexpartOutput.area);
    //         this.variables = flexpartOutput.variables2d;
    //         this.formItems.get('variables').options = this.formService.arrayToOptions(Object.keys(flexpartOutput.variables2d))
    //     }
    // }
    // addControls(keys: string[]) {
    //     const group: any = {};
    //     for (const key of keys) {
    //         // this.formGroup.addControl(key, new FormControl('', Validators.required));
    //         // group[key] = new FormControl('', Validators.required);
    //         this.dimensions.addControl(key, new FormControl('', Validators.required));
    //     }
    //     // this.newControls = group;
    // }

    // varNames() {
    //     return Object.keys(this.variables)
    // }

    onSubmit() {
        // let formFields = this.formService.formToObject();
        let formFields = this.formGroup.value;
        // const asArray = Object.entries(formFields);
        // const filtered = asArray.filter(([key, value]) => key !== this.formItems.get('variables').key);

        // const dimensions = Object.fromEntries(filtered);

        
        formFields = {
            variable: this.selectedVar,
            dimensions: formFields,
            // output: this.fpOutput,
            // dataDirname: this.flexpartOutput.id,
            // flexpartOutput: this.flexpartOutput,
        }
        
        this.formService.adjustDateRecursive(formFields);
        console.log(formFields);
        this.flexpartService.newPlot(this.route.snapshot.parent!.params['fpResultId'], this.route.snapshot.params['fpOutputId'], formFields)
            .subscribe(data => {
                this.store.dispatch(new MapPlotAction.Add(data, 'flexpart'))
            });
    }

    onDailyAverage() {
        this.flexpartService.dailyAverage(this.route.snapshot.parent!.params['fpResultId'], this.route.snapshot.params['fpOutputId']);
    }

}
