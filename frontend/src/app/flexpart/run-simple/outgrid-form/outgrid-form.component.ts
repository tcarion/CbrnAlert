import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
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
    }
  ]
})
export class OutgridFormComponent implements OnDestroy {

  form = new FormGroup({
    area: new FormControl('', Validators.required),
    gridres: new FormControl(gridResolutions[0], Validators.required),
    heights: new FormControl('100.0', Validators.required)
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
