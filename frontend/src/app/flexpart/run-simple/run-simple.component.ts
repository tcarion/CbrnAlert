import { Component, OnInit, ViewChild, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgFormsManager } from '@ngneat/forms-manager';
import * as dayjs from 'dayjs';
import { Observable, Subscription } from 'rxjs';
import { FlexpartInput } from 'src/app/core/api/models';
import { NiceInput } from 'src/app/flexpart/models/nice-input';
import { FlexpartService } from '../flexpart.service';
import { ReleaseFormComponent } from './release-form/release-form.component';
@Component({
  selector: 'app-run-simple',
  templateUrl: './run-simple.component.html',
  styleUrls: ['./run-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunSimpleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ReleaseFormComponent)
  releaseFormComponent!: ReleaseFormComponent;

  input$: Observable<FlexpartInput | undefined>;
  input?: FlexpartInput
  niceInput: NiceInput
  sub: Subscription

  minMaxDate = { min: new Date(1970), max: new Date(2100) };
  start: Date;
  endRel: Date;
  location: { lon: number, lat: number };

  // https://stackoverflow.com/questions/60234369/angular-8-nested-reactive-form-in-sub-component-not-working
  // https://www.dotnetsurfers.com/blog/2020/10/11/3-approaches-for-implementing-nested-forms-in-angular/
  // https://indepth.dev/posts/1055/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms
  // https://indepth.dev/posts/1245/angular-nested-reactive-forms-using-controlvalueaccessors-cvas

  runForm = new UntypedFormGroup({
    numberOfSubstances: new UntypedFormControl(1, [Validators.required, Validators.min(1)]),
    releases: new UntypedFormArray([new UntypedFormControl('', Validators.required)]),
    command: new UntypedFormControl('', Validators.required),
    outgrid: new UntypedFormControl('', Validators.required),
  });

  get numberOfSubstances(): UntypedFormControl {
    return this.runForm.get('numberOfSubstances') as UntypedFormControl;
  }

  get releases() {
    return this.runForm.get('releases') as UntypedFormArray;
  }

  readableInput: any

  constructor(
    public flexpartService: FlexpartService,
    public formsManager: NgFormsManager,
    public fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.input$ = this.flexpartService.selectedInput$;

    this.formsManager.upsert('flexpartRunSimple', this.runForm, {
      arrControlFactory: { releases: val => new UntypedFormControl(val) }
    });
  }

  ngAfterViewInit(): void {
    this.sub = this.input$.subscribe(input => {
      if (input !== undefined) {
        this.input = input;
        this.niceInput = this.flexpartService.niceInput(input);
        this.start = this.niceInput.start;
        const end = this.niceInput.end;
        this.endRel = dayjs(this.start).add(1, 'hour').toDate()
        this.minMaxDate = {min: this.start, max: end}
        this.location = {
          lon: (this.niceInput.area.right - this.niceInput.area.left) / 2 + this.niceInput.area.left,
          lat: (this.niceInput.area.top - this.niceInput.area.bottom) / 2 + this.niceInput.area.bottom
        };
        // Put the location in the middle of the input area
        this.releases.at(0).patchValue({ location: this.location, start: this.start, end: this.endRel })

        // ? for some reason, the parent form is correctly updated for command. But for outgrid, we have
        // ? to manually set the fields or they won't be present by default on runForm.value.outgrid
        this.runForm.get('command')!.patchValue({start: this.start, end})
        this.runForm.get('outgrid')!.patchValue({area: this.niceInput.area, heights: '100.0', gridres: 0.1})
      }
    });

    // Watch for changes in substance number
    this.numberOfSubstances.valueChanges.subscribe(value => {
      this.adjustReleaseFormGroups(value);
    });
  }

  adjustReleaseFormGroups(newNumber: number) {
    const currentNumber = this.releases.length;

    if (newNumber > 0) {
      if (newNumber > currentNumber) {
        // Add new form groups
        for (let i = currentNumber; i < newNumber; i++) {
          this.releases.push(this.releaseFormComponent.createFormGroup(this.location, this.start, this.endRel));
        }
      } else if (newNumber < currentNumber) {
        // Remove excess form groups
        for (let i = currentNumber; i > newNumber; i--) {
          this.releases.removeAt(i-1);
        }
      }
    }
  }

  submit(form: UntypedFormGroup) {
    this.runForm.removeControl('numberOfSubstances');
    let formVals = JSON.parse(JSON.stringify(this.runForm.value))
    formVals.outgrid.heights = (formVals.outgrid.heights as string).split(',').map( h  => { return parseFloat(h.trim()) } )
    this.flexpartService.postRunSimple(formVals, this.input!.uuid).subscribe( res => {
      alert('Flexpart Run has completed!')
      console.log(res)
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}