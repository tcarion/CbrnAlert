import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-wind-form',
    templateUrl: './wind-form.component.html',
    styleUrls: ['./wind-form.component.scss']
})
export class WindFormComponent implements OnInit, OnDestroy {

    @Input() disabled = false;

    windForm = new FormGroup({
        speed: new FormControl(8, Validators.required),
        azimuth: new FormControl(45, Validators.required),
    });

    @Input() formGroup: FormGroup;

    constructor() { }

    ngOnInit(): void {
        this.formGroup.addControl('wind', this.windForm);
    }

    isValid(): boolean {
      return this.windForm.valid;
    }

    ngOnDestroy(): void {
        this.formGroup.removeControl('wind');
    }
}
