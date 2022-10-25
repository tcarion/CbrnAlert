import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
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

  windForm = new FormGroup({
    speed: new FormControl(8, Validators.required),
    azimuth: new FormControl(45, Validators.required),
    stabilityClass: new FormControl(
      this.stabilityClasses[2].id,
      Validators.required
    ),
  });

  @Input() formGroup: FormGroup;

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
