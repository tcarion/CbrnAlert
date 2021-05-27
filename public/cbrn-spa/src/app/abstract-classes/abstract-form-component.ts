import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormService } from './../services/form.service';
import { FormGroup } from '@angular/forms';
import { Form } from './../models/form';

@Component({
    template: ''
  })
export abstract class AbstractFormComponent implements OnInit, OnDestroy {
    formItems: any = {};
    form: Form;

    formGroup: FormGroup;

    constructor(
        public formService: FormService,
    ) {}

    ngOnInit() {
        this.form = new Form(this.formItems);
        this.formGroup = this.formService.initForm(this.form);

        this.formService.newCurrentForm(this.formGroup, this.form);
    }

    onSubmit() {
        
    }

    ngOnDestroy() {
        
    }
}
