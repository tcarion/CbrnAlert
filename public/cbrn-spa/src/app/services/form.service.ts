import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  currentFormSubject = new Subject<FormGroup>();

  currentForm = new FormGroup({});
  constructor() {}

  emitCurrentForm() {
    this.currentFormSubject.next(this.currentForm);
  }

  newCurrentForm(newForm: FormGroup) {
    this.currentForm = newForm;
    this.emitCurrentForm()
  }
}
