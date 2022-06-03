import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'app-wind-form',
    templateUrl: './wind-form.component.html',
    styleUrls: ['./wind-form.component.scss']
})
export class WindFormComponent implements OnInit, OnDestroy {

    windForm = new FormGroup({
        speed: new FormControl(8, isNumber),
        azimuth: new FormControl(45, isNumber),
    });

    @Input() formGroup: FormGroup;

    constructor() { }

    ngOnInit(): void {
        this.formGroup.addControl('wind', this.windForm);
    }

    ngOnDestroy(): void {
        this.formGroup.removeControl('wind');
    }
}

function isNumber(control: AbstractControl): ValidationErrors | null {
    const val = control.value;

    if (isNaN(parseFloat(val))) {
        return { notANumber: { value: val } };
    }
    return null;
}
