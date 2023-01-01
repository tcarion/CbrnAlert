import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs';
import { AppDatePipe } from 'src/app/shared/pipes/app-date-pipe';

const FORMAT = 'DD/MM/YYYY HH:mm:ss'

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DatetimePickerComponent,
    },
  ],
})
export class DatetimePickerComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() steps = {hour:1, minute:1, second:1}
  control = new UntypedFormControl(new Date());

  date: Date;

  touched = false;

  disabled = false;

  onChange = (value: any) => {};

  onTouched = () => {};

  onChangeSubs: Subscription[] = [];

  constructor(
  ) {}

  ngOnInit(): void {}

  writeValue(value: any) {
    if (value) {
      // const newVal = this.appDate.transform(value)
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: any) {
    const sub = this.control.valueChanges.subscribe(onChange);
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
