import { ShapeData } from './../interfaces/atp45/shape-data';
import { formatDate } from '@angular/common';
import { Shape } from 'src/app/interfaces/atp45/shape-data';
import { FormItem } from './../interfaces/form-item';
import { Form } from './../models/form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FormService {

    currentFormSubject = new Subject<FormGroup>();

    currentForm = new FormGroup({});
    constructor(
        private formBuilder: FormBuilder
    ) { }

    emitCurrentForm() {
        this.currentFormSubject.next(this.currentForm);
    }

    newCurrentForm(newForm: FormGroup) {
        this.currentForm = newForm;
        this.emitCurrentForm()
    }

    initForm(form: Form): FormGroup {
        let formControls: { [k: string]: any } = {};
        form.formItems.forEach((formItem: FormItem) => {
            let validators = formItem.validators === undefined ? [] : formItem.validators
            formControls[formItem.controlName] = [formItem.placeholder === undefined ? '' : formItem.placeholder, validators]
        });
        return this.formBuilder.group(formControls);
    }

    handlePredictionResponse(shapeData: any): ShapeData {
        let shapes = shapeData.shapes;
        shapeData.datetime = new Date(shapeData.datetime)
        let speed = Math.round(shapeData.wind.speed * 3.6 * 10) / 10;
        shapes.forEach((shape: Shape, i: number) => {
            shape.coords = shape.lons.map((l, i) => [shape.lats[i], l]);
            shape.text =
                `<b>${shape.label}</b><br>
            <b>Coordinates : (${shapeData.lat}, ${shapeData.lon})</b><br>
            wind speed = ${speed} km/h<br>
            date = ${formatDate(shapeData.datetime, 'yyyy-MM-dd', "en-US")}<br>
            time = ${formatDate(shapeData.datetime, 'HH:mm', "en-US")}<br>
            step = ${shapeData.step}`;
        });
        return shapeData;
    }
}
