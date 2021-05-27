import { FormItem } from './../../interfaces/form-item';
import { Form } from './../../models/form';
import { FormService } from './../../services/form.service';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractFormComponent } from 'src/app/abstract-classes/abstract-form-component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent extends AbstractFormComponent implements OnInit, OnDestroy {

    @Input() formItems: FormItem[];
    // @Input() formGroup: FormGroup;

    @Output() formSubmit = new EventEmitter<any>();
    // @Output() formGroupChange = new EventEmitter<FormGroup>();
    constructor(
        public formService: FormService,
    ) {
        super(formService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onSubmit() {
        this.formSubmit.emit();
    }

    // getControl(name: string) {
    //     console.log("control : " + name)
    //     return this.formGroup.get(name) as FormControl;
    // }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

}
