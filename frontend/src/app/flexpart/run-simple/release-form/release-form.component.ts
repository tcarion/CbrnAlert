import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from 'src/app/core/services/form.service';
import { DropdownQuestion } from 'src/app/shared/form/dropdown-question';
import { QuestionBase } from 'src/app/shared/form/question-base';

@Component({
  selector: 'app-release-form',
  templateUrl: './release-form.component.html',
  styleUrls: ['./release-form.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: ReleaseFormComponent
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ReleaseFormComponent),
      multi: true
    }
]
})
export class ReleaseFormComponent implements ControlValueAccessor, OnDestroy {
  form = new FormGroup({
    location: new FormControl({lon: 0, lat: 0}, Validators.required),
    height: new FormControl(1.5, Validators.required),
    mass: new FormControl(1., Validators.required),
    start: new FormControl(new Date(), Validators.required),
    end: new FormControl(new Date(), Validators.required)
  })

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
    return { invalidForm: { valid: false, message: 'all fields are required' } };
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
