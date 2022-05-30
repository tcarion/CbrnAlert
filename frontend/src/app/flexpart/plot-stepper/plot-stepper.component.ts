import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-plot-stepper',
  templateUrl: './plot-stepper.component.html',
  styleUrls: ['./plot-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlotStepperComponent implements OnInit {

  selectedRunId: string
  selectedOutputId: string
  selectedLayer: string

  constructor() {
  }

  ngOnInit(): void {
  }

  selectionChanged(e: any) { }
}
