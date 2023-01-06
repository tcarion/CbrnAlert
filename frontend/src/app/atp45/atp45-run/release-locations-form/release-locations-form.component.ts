import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormRecord, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { GeoPoint } from 'src/app/core/api/models';

@Component({
  selector: 'app-release-locations-form',
  templateUrl: './release-locations-form.component.html',
  styleUrls: ['./release-locations-form.component.scss']
})
export class ReleaseLocationsFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() parentForm: FormRecord;
  @Input() numberOfLocations: number = 1;

  locationsFormArray = this.createForm(this.numberOfLocations)
  constructor() {
  }

  get locationsControl() {
    return this.locationsFormArray.controls
  }

  ngOnInit(): void {
    this.parentForm.addControl('locations', this.locationsFormArray);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const prev = changes.numberOfLocations.previousValue;
    const next = changes.numberOfLocations.currentValue;
    const diff = next - prev;
    for (let i = 0; i < Math.abs(diff); i++) {
      diff < 0 && (this.locationsFormArray.removeAt(this.locationsFormArray.length - 1))
      diff > 0 && (this.locationsFormArray.push(this.createControl()))
    }
  }

  isValid(): boolean {
    return this.locationsFormArray.valid;
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl('locations');
  }

  createForm(n: number) {
    const initForm = new FormArray([this.createControl()]);

    for (let i = 1; i < this.numberOfLocations; i++) {
      initForm.push(this.createControl())
    }
    return initForm;
  }

  createControl() {
    return new FormControl<GeoPoint>({ lon: 0, lat: 0 }, [Validators.required])
  }
}
