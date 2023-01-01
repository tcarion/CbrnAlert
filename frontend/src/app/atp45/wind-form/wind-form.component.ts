import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-wind-form',
  templateUrl: './wind-form.component.html',
  styleUrls: ['./wind-form.component.scss'],
})
export class WindFormComponent implements OnInit, OnDestroy {
  stabilityClasses = [
    { id: 'Unstable', key: 'Unstable' },
    { id: 'Neutral', key: 'Neutral' },
    { id: 'Stable', key: 'Stable' },
  ];

  @Input() disabled = false;

  windForm = new UntypedFormGroup({
    speed: new UntypedFormControl(8, Validators.required),
    azimuth: new UntypedFormControl(45, Validators.required),
    stabilityClass: new UntypedFormControl(
      this.stabilityClasses[2].id,
      Validators.required
    ),
  });

  @Input() formGroup: UntypedFormGroup;

  constructor() {}

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
