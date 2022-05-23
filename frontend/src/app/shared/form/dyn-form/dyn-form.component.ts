import { FormService } from 'src/app/core/services/form.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../question-base';

@Component({
    selector: 'app-dyn-form',
    templateUrl: './dyn-form.component.html',
    providers: [FormService],
})
export class DynFormComponent implements OnInit {

    @Input() questions: QuestionBase<string>[] | null;
    @Input() parentForm?: FormGroup;
    @Input() formName?: string
    form!: FormGroup;
    payLoad = '';

    constructor(private formService: FormService) { }

    ngOnInit() {
        this.form = this.formService.toFormGroup_(this.questions as QuestionBase<string>[]);
        if (this.parentForm && this.formName) {
            this.parentForm.addControl(this.formName, this.form)
        }
    }

    //   onSubmit() {
    //     this.payLoad = JSON.stringify(this.form.getRawValue());
    //   }
}