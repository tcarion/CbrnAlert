import { formatDate } from '@angular/common';
import { FormItem } from '../models/form-item';
import { Form } from '../models/form';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormItemBase } from 'src/app/shared/form/form-item-base';

@Injectable({
    providedIn: 'root',
})
export class FormService {

    currentFormSubject = new Subject<{formGroup: FormGroup, form: Form}>();

    currentForm = {formGroup: new FormGroup({}), form: new Form([])};
    constructor(
        private formBuilder: FormBuilder
    ) { }

    emitCurrentForm() {
        this.currentFormSubject.next(this.currentForm);
    }

    newCurrentForm(formGroup: FormGroup, form: Form) {
        this.currentForm = {formGroup, form};
        this.emitCurrentForm();
    }

    initForm(form: Form): FormGroup {
        let formControls: { [k: string]: any } = {};
        form.formItems.forEach((formItem: FormItem) => {
            let validators = formItem.validators === undefined ? [] : formItem.validators
            formControls[formItem.controlName] = [formItem.value === undefined ? '' : formItem.value.display, validators]
        });
        return this.formBuilder.group(formControls);
    }

    toFormGroup(items: FormItemBase<String>[]) {
        const group: any = {};

        items.forEach(item => {
            group[item.key] = item.required ? new FormControl(item.value || '', Validators.required)
                : new FormControl(item.value || '');
        });
        return new FormGroup(group);
    }

    arrayToOptions(array: Array<any>) {
        return array.map(key => { return {key: key} })
    }

    optionsToArray(options: {key: string}[]) {
        return options.map(e => { return e.key })

    }

    emitIfLonLatValid() {
        if (this.currentForm.formGroup.get('lat')?.valid && this.currentForm.formGroup.get('lon')?.valid) {
            this.emitCurrentForm();
        }
    }

    // handlePredictionResponse(shapeData: any): ShapeData {
    //     let shapes = shapeData.shapes;
    //     shapeData.datetime = new Date(shapeData.datetime)
    //     let speed = Math.round(shapeData.wind.speed * 3.6 * 10) / 10;
    //     shapes.forEach((shape: Shape, i: number) => {
    //         shape.coords = shape.lons.map((l, i) => [shape.lats[i], l]);
    //         shape.text =
    //             `<b>${shape.label}</b><br>
    //         <b>Coordinates : (${shapeData.lat}, ${shapeData.lon})</b><br>
    //         wind speed = ${speed} km/h<br>
    //         date = ${formatDate(shapeData.datetime, 'yyyy-MM-dd', "en-US")}<br>
    //         time = ${formatDate(shapeData.datetime, 'HH:mm', "en-US")}<br>
    //         step = ${shapeData.step}`;
    //     });
    //     return shapeData;
    // }

    formToObject() {
        let obj: { [k:string]: any} = {};
        const controls = this.currentForm.formGroup.controls;
        const form = this.currentForm.form;
        for (const p in controls) {
            let formItem = form.get(p);
            if (formItem.type == "input" && formItem.controlName.includes('area')) {
                obj[p] = formItem.value?.obj
            } else {
                let val = this.currentForm.formGroup.controls[p].value;
                if (val instanceof Date) {
                    val = this.removeTimeZone(val);
                }
                obj[p] = val;
            }
        }
        return obj;
    }

    arrayToSelect(controlNames: string[], values: any){
            controlNames.map((e, i) => {
                this.currentForm.form.newVal(e, values[i]);
                this.currentForm.formGroup.get(e)?.patchValue(values[i][0]);
        });
    }

    removeTimeZone(date: Date) {
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset)
    }

    toDate(day: Date, time: string): Date {
        const dateStr = formatDate(day, 'yyyy-MM-dd', 'en-US');
        return new Date(dateStr + 'T' + time);
    }
}
