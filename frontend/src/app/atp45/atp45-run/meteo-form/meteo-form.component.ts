import { FormGroup, FormRecord } from '@angular/forms';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-meteo-form',
  templateUrl: './meteo-form.component.html',
  styleUrls: ['./meteo-form.component.scss']
})
export class MeteoFormComponent {

  @Input() withWind: boolean = true;
  @Input() withStability: boolean = true;
  @Input() parentForm: FormRecord;

  meteoForm = new FormRecord({})
  // meteoForm = new FormGroup<MeteoForm>({})
  ngOnInit(): void {
    this.parentForm.addControl('weather', this.meteoForm);
  }

  isValid(): boolean {
    return this.meteoForm.valid;
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl('weather');
  }
}
