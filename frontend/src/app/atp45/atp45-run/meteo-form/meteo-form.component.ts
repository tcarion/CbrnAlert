import { FormGroup, FormRecord } from '@angular/forms';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-meteo-form',
  templateUrl: './meteo-form.component.html',
  styleUrls: ['./meteo-form.component.scss']
})
export class MeteoFormComponent {

  @Input() withWind: boolean = true;
  @Input() withStability: boolean = false;

  meteoForm = new FormRecord({})
  // meteoForm = new FormGroup<MeteoForm>({})
}
