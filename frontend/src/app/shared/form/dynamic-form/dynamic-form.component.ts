import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/core/services/form.service';
import { FormItemBase } from '../form-item-base';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent {
    @Input() item: FormItemBase;
    @Input() formGroup!: FormGroup;

    get isValid() { return this.formGroup.controls[this.item.key].valid; }

}
