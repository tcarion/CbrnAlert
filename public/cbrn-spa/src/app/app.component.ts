import { FormItem } from './interfaces/form-item';
import { Component } from '@angular/core';
import { wrongLatValidator, wrongLonValidator } from './shared/validators';
import { Validators } from '@angular/forms';

let preloadedForm: FormItem[] = [
    {
        controlName: 'lat',
        label: 'Release latitude [°]',
        type: 'input',
        hint: '[-90.0°, 90.0°]',
        validators: [wrongLatValidator(), Validators.required]
    },
    {
        controlName: 'lon',
        label: 'Release longitude [°]',
        type: 'input',
        hint: '[-180°, 180°]',
        validators: [wrongLonValidator(), Validators.required]
    },
    {
        controlName: 'datetime',
        label: 'Forecast step selection: ',
        type: 'select',
    },
]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  forms = {preloadedForm};
}
