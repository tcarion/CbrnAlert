import { Component, Input } from '@angular/core';
import { FormControl, FormRecord, Validators } from '@angular/forms';
import { FormGroup } from '@ngneat/reactive-forms';

@Component({
  selector: 'app-wind-form',
  templateUrl: './wind-form.component.html',
  styleUrls: ['./wind-form.component.scss']
})
export class WindFormComponent {
  @Input() disabled = false;
  // @Input() parentForm: FormGroup<MeteoForm>;
  @Input() parentForm: FormRecord;

  windForm = new FormGroup({
    // windForm = new FormGroup<WindForm>({
    speed: new FormControl(8, [Validators.required]),
    azimuth: new FormControl(45, [Validators.required]),
  });


  constructor() {}

  ngOnInit(): void {
    this.parentForm.addControl('wind', this.windForm);
  }

  isValid(): boolean {
    return this.windForm.valid;
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl('wind');
  }
}
