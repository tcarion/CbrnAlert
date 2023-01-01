import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionBase } from '../question-base';


@Component({
  selector: 'app-question',
  templateUrl: './dyn-form-question.component.html'
})
export class DynFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: UntypedFormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}