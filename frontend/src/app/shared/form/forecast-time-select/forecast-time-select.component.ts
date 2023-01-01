import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ForecastAvailableSteps } from './../../../core/api/models/forecast-available-steps';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-forecast-time-select',
  templateUrl: './forecast-time-select.component.html',
  styleUrls: ['./forecast-time-select.component.scss']
})
export class ForecastTimeSelectComponent implements OnInit, OnDestroy {

  @Input() leadtimes: string[];
  @Input() formGroup: UntypedFormGroup;
  leadtime = new UntypedFormControl('', Validators.required);
  constructor() { }

  ngOnInit(): void {
    this.formGroup.addControl('leadtime', this.leadtime)
  }

  ngOnDestroy(): void {
    this.formGroup.removeControl('leadtime')
  }
}
