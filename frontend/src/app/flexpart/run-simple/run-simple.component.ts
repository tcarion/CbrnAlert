import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgFormsManager } from '@ngneat/forms-manager';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { FlexpartInput } from 'src/app/core/api/models';
import { NiceInput } from 'src/app/flexpart/models/nice-input';
import { FlexpartService } from '../flexpart.service';

@Component({
  selector: 'app-run-simple',
  templateUrl: './run-simple.component.html',
  styleUrls: ['./run-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunSimpleComponent implements OnInit {

  input$: Observable<FlexpartInput | undefined>;
  input?: FlexpartInput
  niceInput: NiceInput

  minMaxDate = {
    min: new Date(1970),
    max: new Date(2100),
  }

  runForm = new FormGroup({
    releases: new FormArray([new FormControl('', Validators.required)]),
    // command: new FormControl('', Validators.required),
    command: new FormControl('', Validators.required),
    outgrid: new FormControl('', Validators.required),
  });

  readableInput: any
  // releasesForm = new FormArray([new FormControl('')])

  constructor(
    public flexpartService: FlexpartService,
    public formsManager: NgFormsManager,
  ) { }

  ngOnInit(): void {
    this.input$ = this.flexpartService.selectedInput$;
    this.input$.subscribe(input => {
      if (input !== undefined) {
        this.input = input;
        this.niceInput = this.flexpartService.niceInput(input);
        const start = this.niceInput.start;
        const end = this.niceInput.end;
        const endRel = dayjs(end).add(1, 'hour').toDate()
        this.minMaxDate = {min: start, max: end}
        this.releases.at(0).patchValue({start, end: endRel})
        this.runForm.get('command')!.patchValue({start, end})
      }
    })
    this.formsManager.upsert('flexpartRunSimple', this.runForm, {
      arrControlFactory: { releases: val => new FormControl(val) }
    })
  }

  get releases() {
    return this.runForm.get('releases') as FormArray;
  }

  submit(form: FormGroup) {
    console.log(form.value)
  }
}
