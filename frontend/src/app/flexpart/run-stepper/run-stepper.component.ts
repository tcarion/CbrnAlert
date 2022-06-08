import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-run-stepper',
  template: `
			<mat-horizontal-stepper [linear]="true">

        <mat-step label="Choose Flexpart Input">
          <app-inputs #input></app-inputs>
          <div>
            <button mat-raised-button matStepperNext [disabled]="input.value == undefined">Next</button>
          </div>
        </mat-step>

        <mat-step label="Choose Flexpart options">
          <ng-template matStepContent>
            <app-run-simple></app-run-simple>
          </ng-template>
        </mat-step>

      </mat-horizontal-stepper>
		`,
  styles: [`

		`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunStepperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
