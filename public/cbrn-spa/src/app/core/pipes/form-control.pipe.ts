import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../services/form.service';

@Pipe({
    name: 'formControl'
})
export class FormControlPipe implements PipeTransform {

    constructor(private formService: FormService) {}

    transform(name: string): FormControl {
        return this.formService.currentForm.formGroup.get(name) as FormControl;
    }

}
