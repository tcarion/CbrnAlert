import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from 'src/app/core/services/form.service';
import { DropdownQuestion } from 'src/app/shared/form/dropdown-question';
import { QuestionBase } from 'src/app/shared/form/question-base';


import { MatDialog } from '@angular/material/dialog';
import { GeometryPopupComponent } from './geometry-popup/geometry-popup.component';

const substanceNames = [{
  key: 24,
  value: 'Generic Air Tracer'
},
{
  key: 16,
  value: 'Caesium-137'
},
{
  key: 21,
  value: 'Xenon-133'
},
{
  key: 20,
  value: 'Strontium-90'
},
{
  key: 52,
  value: 'Sarin'
},
{
  key: 53,
  value: 'VX'
},
{
  key: 54,
  value: 'Benzene'
}]

const geometryNames = [{
  value: 'Point'
},
{
  value: 'Box'
}]

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
  @Input() dateRange: {min: Date, max: Date} = {min: new Date(1950), max: new Date(2200)};

  substanceNames = substanceNames;
  geometryNames = geometryNames;

  form = new UntypedFormGroup({
    location: new UntypedFormControl({lon: 0, lat: 0}, Validators.required),
    height: new UntypedFormControl(1.5, Validators.required),
    substanceName: new UntypedFormControl(substanceNames[0].key, Validators.required),
    geometryName: new UntypedFormControl(geometryNames[0].value, Validators.required),
    mass: new UntypedFormControl(1., Validators.required),
    start: new UntypedFormControl(new Date(), Validators.required),
    end: new UntypedFormControl(new Date(), Validators.required)
  })

  constructor(public dialog: MatDialog) {}

  createFormGroup(loc: {lon: number, lat: number}, start: Date, end: Date): UntypedFormGroup {
    return new UntypedFormGroup({
      location: new UntypedFormControl(loc, Validators.required),
      height: new UntypedFormControl(1.5, Validators.required),
      substanceName: new UntypedFormControl(substanceNames[0].key, Validators.required),
      geometryName: new UntypedFormControl(geometryNames[0].value, Validators.required),
      mass: new UntypedFormControl(1., Validators.required),
      start: new UntypedFormControl(start, Validators.required),
      end: new UntypedFormControl(end, Validators.required)
    });
  }

  touched = false;
  disabled = false;
  onChange = (value: any) => { };
  onTouched = () => { };
  onChangeSubs: Subscription[] = [];

  onGeometryChange(event: any) {
    const selectedValue = event.value;
    if (selectedValue === 'Box') {
      this.openDialog(); // Open the dialog if "Box" is selected
    }
  }

  openDialog(): void {
    this.dialog.open(GeometryPopupComponent);
  }

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