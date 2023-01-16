import { FormControl, FormRecord, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ForecastAvailableSteps } from './../../../core/api/models/forecast-available-steps';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetComponent } from 'src/app/shared/form/fieldset/fieldset.component';

@Component({
  selector: 'app-forecast-time-select',
  templateUrl: './forecast-time-select.component.html',
  styleUrls: ['./forecast-time-select.component.scss'],
  // standalone: true,
  // imports: [CommonModule, FieldsetComponent]
})
export class ForecastTimeSelectComponent implements OnInit, OnDestroy {

  @Input() leadtimes: string[] | null = [];
  @Input() formGroup: FormRecord;
  leadtime = new FormControl('', Validators.required);
  constructor() {
  }

  ngOnInit(): void {
    this.leadtimes !== null && this.leadtime.patchValue(this.leadtimes[0])
    this.formGroup.addControl('leadtime', this.leadtime)
  }

  ngOnDestroy(): void {
    this.formGroup.removeControl('leadtime')
  }
}
