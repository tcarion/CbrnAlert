import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/core/services/form.service';
import { FormItemBase } from '../form-item-base';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
    @Input() items: FormItemBase<String>[];

    dynamicForm: FormGroup;

    constructor(
        public formService: FormService,
    ) { }

    ngOnInit(): void {
        this.dynamicForm = this.formService.toFormGroup(this.items);
    }

}
