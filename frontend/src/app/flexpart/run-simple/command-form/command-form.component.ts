import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from 'src/app/core/services/form.service';
import { DropdownQuestion } from 'src/app/shared/form/dropdown-question';
import { QuestionBase } from 'src/app/shared/form/question-base';

const timeSteps = [{
  key: 15*60,
  value: '15 min'
},
{
  key: 30*60,
  value: '30 min'
},
{
  key: 1*60*60,
  value: '1 hours'
}]

@Component({
  selector: 'app-command-form',
  templateUrl: './command-form.component.html',
  styleUrls: ['./command-form.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: CommandFormComponent
    }
  ]
})
export class CommandFormComponent {

  form = new FormGroup({
    start: new FormControl(new Date(), Validators.required),
    end: new FormControl(new Date(), Validators.required),
    timeStep: new FormControl(timeSteps[0].key, Validators.required),
    nstep: new FormControl(5, Validators.required),
  })

  timeSteps = timeSteps;

  touched = false;

  disabled = false;

  onChange = (value: any) => { };

  onTouched = () => { };

  onChangeSubs: Subscription[] = [];

  constructor(
    public formService: FormService
  ) {
  }

  // ngOnInit(): void {
  // }

  writeValue(value: any) {
      if (value) {
          this.form.patchValue(value, { emitEvent: false });
      }
  }

  registerOnChange(onChange: any) {
      const sub = this.form.valueChanges.subscribe(onChange);
      this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: any) {
      this.onTouched = onTouched;
  }

  markAsTouched() {
      if (!this.touched) {
          this.onTouched();
          this.touched = true;
      }
  }

  setDisabledState(disabled: boolean) {
      this.disabled = disabled;
  }

  ngOnDestroy() {
      for (let sub of this.onChangeSubs) {
          sub.unsubscribe();
      }
  }
}
