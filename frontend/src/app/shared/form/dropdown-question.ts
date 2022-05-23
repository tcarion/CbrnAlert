import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase<string|number> {
  override controlType = 'dropdown';
}