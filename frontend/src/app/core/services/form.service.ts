import { formatDate } from '@angular/common';
import { FormItem } from '../models/form-item';
import { Form } from '../models/form';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    UntypedFormControl,
    Validators,
    ValidationErrors,
    AbstractControl,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormItemBase } from 'src/app/shared/form/form-item-base';
import * as dayjs from 'dayjs';
import { MapService } from './map.service';
import { CbrnMap } from '../models/cbrn-map';
import { filter, map, tap } from 'rxjs/operators';
import { QuestionBase } from 'src/app/shared/form/question-base';
import { FormControl as neatFormControl, FormGroup as neatFormGroup } from '@ngneat/reactive-forms'
// import { LonlatControl } from 'src/app/shared/form/lonlat-control';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    // currentFormSubject = new Subject<{ formGroup: FormGroup; form: Form }>();

    // currentForm = { formGroup: new FormGroup({}), form: new Form([]) };
    constructor(
        private formBuilder: UntypedFormBuilder,
        private mapService: MapService,
    ) { }

    // emitCurrentForm() {
    //     this.currentFormSubject.next(this.currentForm);
    // }

    // newCurrentForm(formGroup: FormGroup, form: Form) {
    //     this.currentForm = { formGroup, form };
    //     this.emitCurrentForm();
    // }

    // initForm(form: Form): FormGroup {
    //     let formControls: { [k: string]: any } = {};
    //     form.formItems.forEach((formItem: FormItem) => {
    //         let validators =
    //             formItem.validators === undefined ? [] : formItem.validators;
    //         formControls[formItem.controlName] = [
    //             formItem.value === undefined ? '' : formItem.value.display,
    //             validators,
    //         ];
    //     });
    //     return this.formBuilder.group(formControls);
    // }

    patchMarker(formGroup: UntypedFormGroup, marker: any) {
        marker !== undefined && formGroup.patchValue({
            lon: `${marker.lon}`,
            lat: `${marker.lat}`,
        });
    }

    lonlatValid(formGroup: UntypedFormGroup): Observable<any> {
        const lonlatControls = Object.entries(formGroup.controls).filter(e => (e[0] == 'lat' || e[0] == 'lon'))
        const lonlatGroup = new UntypedFormGroup(Object.fromEntries(lonlatControls));
        return lonlatGroup.statusChanges.pipe(
            filter(status => status === 'VALID')
        );
    }

    // lonlatValid2(formGroup: FormGroup): Observable<any> {
    //     return formGroup.statusChanges.pipe(
    //         filter(status => status === 'VALID'),
    //         tap(() => {
    //             // this.mapService.cbrnMap.marker = this.getLonlat(formGroup);
    //         })
    //     );
    // }

    getLonlat(formGroup: UntypedFormGroup) {
        const lon = formGroup.get('lon')?.value;
        const lat = formGroup.get('lat')?.value;
        return { lon, lat };
    }

    toControl(item: FormItemBase) {
        let validators = item.required ? [Validators.required] : []
        item.validators?.forEach(validator => { validators.push(validator) })
        return new UntypedFormControl(item.value || '', validators);
    }

    toFormGroup(items: FormItemBase[]) {
        const group: any = {};

        items.forEach((item) => {
            group[item.key] = this.toControl(item);
        });

        return new UntypedFormGroup(group);
    }

    toControl_(question: QuestionBase<any>) {
      let value = question.value
      if (!value) {
          value = typeof question.value == 'number' ? 0 : ''
      }
      let control = question.required ? new UntypedFormControl(value, Validators.required) : new UntypedFormControl(value)
      return {name: question.key, control}
    }

    toFormGroup_(questions: QuestionBase<string|number>[]) {
        const group: any = {};

        questions.forEach(question => {
            let value = question.value
            if (!value) {
                value = typeof question.value == 'number' ? 0 : ''
            }
            group[question.key] = question.required ? new UntypedFormControl(value, Validators.required)
                : new UntypedFormControl(value);
        });
        return new UntypedFormGroup(group);
    }

    arrayToOptions(array: Array<any>) {
        const re = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const format = 'YYYY-MM-DD @ HH:mm';
        return array.map((key) => {
            let value;
            let nkey = key;
            if (key instanceof Date) {
                const formated = dayjs(key).format(format);
                value = formated;
            }
            else if (typeof key == 'string' && key.match(re)) {
                const found = key.match(re)![0];
                nkey = dayjs(found, 'YYYY-MM-DDTHH:mm:ss');
                value = nkey.format(format);
                nkey = nkey.toISOString();
            }
            else {
                value = key.toString();
            }
            return { key: nkey, value: value };
        });
    }

    objectToOptions(array: Array<{ [k: string]: any }>) {
        return array.map((obj) => {
            const arrOb = Object.entries(obj);
            const key = arrOb[0][1];
            const val = arrOb[1][1]
            return { key: key, value: this.formatIfDate(val) };
        });
    }

    mapObjectToOptions(values: Array<any>, objects: Array<Object>) {
        let options = []
        for (let i = 0; i < values.length; i++) {
            options.push(
                {
                    key: i,
                    value: values[i],
                    object: objects[i]
                }
            )
        }
        return options;
    }

    formatIfDate(value: any): string {
        const re = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const format = 'YYYY-MM-DD @ HH:mm';
        let nvalue = value;
        if (value instanceof Date) {
            const formated = dayjs(value).format(format);
            nvalue = formated;
        }
        else if (typeof value == 'string' && value.match(re)) {
            const found = value.match(re)![0];
            nvalue = dayjs(found, 'YYYY-MM-DDTHH:mm:ss').format(format);
        }
        else {
            nvalue = nvalue.toString();
        }
        return nvalue;
    }

    strToDate(str: string) {
        const re = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const match = str.match(re);
        return match ? dayjs(match[0], 'YYYY-MM-DDTHH:mm:ss').toDate() : undefined
    }

    adjustDateRecursive(obj: any) {
        for (const k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                if (typeof obj[k] == 'object' && obj[k] !== null) {
                    this.adjustDateRecursive(obj[k])
                } else if (obj[k] instanceof Date) {
                    // obj[k] = this.removeTimeZone(obj[k])
                    obj[k] = dayjs(obj[k]).add(4, 'h').toDate()
                } else if (typeof obj[k] == 'string') {
                    const toD = this.strToDate(obj[k]);
                    // obj[k] = toD ? this.removeTimeZone(toD) : obj[k]
                    obj[k] = toD ? dayjs(toD).add(4, 'h').toDate() : obj[k]
                }

            }
        }
    }

    optionsToArray(options: { key: string }[]) {
        return options.map((e) => {
            return e.key;
        });
    }

    // emitIfLonLatValid() {
    //     if (
    //         this.currentForm.formGroup.get('lat')?.valid &&
    //         this.currentForm.formGroup.get('lon')?.valid
    //     ) {
    //         this.emitCurrentForm();
    //     }
    // }

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

    // formToObject() {
    //     let obj: { [k: string]: any } = {};
    //     const controls = this.currentForm.formGroup.controls;
    //     const form = this.currentForm.form;
    //     for (const p in controls) {
    //         let formItem = form.get(p);
    //         if (formItem.type == 'input' && formItem.controlName.includes('area')) {
    //             obj[p] = formItem.value?.obj;
    //         } else {
    //             let val = this.currentForm.formGroup.controls[p].value;
    //             if (val instanceof Date) {
    //                 val = this.removeTimeZone(val);
    //             }
    //             obj[p] = val;
    //         }
    //     }
    //     return obj;
    // }

    // arrayToSelect(controlNames: string[], values: any) {
    //     controlNames.map((e, i) => {
    //         this.currentForm.form.newVal(e, values[i]);
    //         this.currentForm.formGroup.get(e)?.patchValue(values[i][0]);
    //     });
    // }

    removeTimeZone(date: Date) {
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset);
    }

    adjustDates(object: any) {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (element instanceof Date) {
                    object[key] = this.removeTimeZone(element);
                }
            }
        }
    }

    toDate(day: Date, time: string): Date {
        const dateStr = formatDate(day, 'yyyy-MM-dd', 'en-US');
        return new Date(dateStr + 'T' + time);
    }
}
