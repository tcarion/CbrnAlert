import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, forwardRef } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

const gridResolutions = [
  0.1,
  0.05,
  0.01,
  0.005,
]

@Component({
  selector: 'app-outgrid-form',
  templateUrl: './outgrid-form.component.html',
  styleUrls: ['./outgrid-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: OutgridFormComponent
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OutgridFormComponent),
      multi: true
    }
  ]
})
export class OutgridFormComponent implements ControlValueAccessor, OnDestroy {

  form = new UntypedFormGroup({
    area: new UntypedFormControl('', Validators.required),
    gridres: new UntypedFormControl(gridResolutions[0], Validators.required),
    heights: new UntypedFormControl('100.0', Validators.required)
  })

  gridResolutions = gridResolutions;

  touched = false;

  disabled = false;

  onChange = (value: any) => { };

  onTouched = () => { };

  onChangeSubs: Subscription[] = [];

  constructor(
  ) {

  }

  // ngOnInit(): void {
  // }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    }
    return { invalidForm: { valid: false, message: 'All fields are required' } };
  }

  writeValue(value: any) {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: any) {
    const sub = this.form.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  ngOnDestroy() {
    for (let sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }
}
