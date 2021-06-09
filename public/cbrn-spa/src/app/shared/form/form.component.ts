import { FormService } from 'src/app/core/services/form.service';
import { FormItem } from '../../core/models/form-item';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Form } from 'src/app/core/models/form';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
    form: Form;

    formGroup: FormGroup;

    @Input() formItems: FormItem[];
    // @Input() formGroup: FormGroup;

    @Output() formSubmit = new EventEmitter<any>();
    // @Output() formGroupChange = new EventEmitter<FormGroup>();
    constructor(
        public formService: FormService,
    ) {}

    ngOnInit() {
        this.form = new Form(this.formItems);
        this.formGroup = this.formService.initForm(this.form);

        this.formService.newCurrentForm(this.formGroup, this.form);
    }

    onSubmit() {
        this.formSubmit.emit();
    }

    // getControl(name: string) {
    //     console.log("control : " + name)
    //     return this.formGroup.get(name) as FormControl;
    // }

    ngOnDestroy() {

    }

}
