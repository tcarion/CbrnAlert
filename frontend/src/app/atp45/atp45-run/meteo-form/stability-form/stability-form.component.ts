import { StabilityClass } from './../../form-interfaces';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormRecord } from '@angular/forms';

@Component({
  selector: 'app-stability-form',
  templateUrl: './stability-form.component.html',
  styleUrls: ['./stability-form.component.scss']
})
export class StabilityFormComponent {

  @Input() parentForm: FormRecord;


  stabilityClasses = Object.values(StabilityClass)

  stabilityForm = new FormGroup({
    // windForm = new FormGroup<WindForm>({
    stabilityClass: new FormControl(StabilityClass.STABLE, {nonNullable: true}),
  });

  ngOnInit(): void {
    this.parentForm.addControl('stability', this.stabilityForm);
  }

  isValid(): boolean {
    return this.stabilityForm.valid;
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl('stability');
  }

}
