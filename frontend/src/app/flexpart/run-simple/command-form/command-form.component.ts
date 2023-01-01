import { Component, OnInit, ChangeDetectionStrategy, forwardRef, OnDestroy, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, ControlValueAccessor, AbstractControl, ValidationErrors } from '@angular/forms';
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
const outputTypes = [
  {
  key: 1,
  value: 'mass'
  },
  {
    key: 2,
    value: 'pptv'
  },
  {
    key: 3,
    value: 'mass & pptv'
  },
  {
    key: 4,
    value: 'plume'
  },
  {
    key: 5,
    value: 'mass & plume'
  },
]

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
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CommandFormComponent),
      multi: true
    }
  ]
})
export class CommandFormComponent implements ControlValueAccessor, OnDestroy {
  @Input() dateRange: {min: Date, max: Date} = {min: new Date(1950), max: new Date(2200)};

  form = new UntypedFormGroup({
    start: new UntypedFormControl(new Date(), Validators.required),
    end: new UntypedFormControl(new Date(), Validators.required),
    timeStep: new UntypedFormControl(timeSteps[0].key, Validators.required),
    outputType: new UntypedFormControl(outputTypes[0].key, Validators.required),
    // nstep: new FormControl(0, Validators.required),
  })

  timeSteps = timeSteps;
  outputTypes = outputTypes;

  touched = false;

  disabled = false;

  onChange = (value: any) => { };

  onTouched = () => { };

  onChangeSubs: Subscription[] = [];

  constructor(
    public formService: FormService
  ) {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    }
    return { invalidForm: { valid: false, message: 'all fields are required' } };
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
