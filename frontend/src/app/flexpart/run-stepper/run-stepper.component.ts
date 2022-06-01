import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-run-stepper',
  templateUrl: './run-stepper.component.html',
  styleUrls: ['./run-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunStepperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
