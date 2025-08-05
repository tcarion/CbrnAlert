import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { SliceResponseType } from './../flexpart-plot-data';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';

@Component({
  selector: 'app-plot-stepper',
  templateUrl: './plot-stepper.component.html',
  styleUrls: ['./plot-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlotStepperComponent implements OnInit {

  selectedRunId: string
  selectedOutputId: string
  selectedLayer: { value: string; label: string };

  sliceTypes = Object.values(SliceResponseType);

  constructor(
    private flexpartService: FlexpartService,
    private mapPlotsService: MapPlotsService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  selectType(val: SliceResponseType) {
    this.flexpartService.selectedSliceType = val;
  }
  
  get selectedSliceType() {
    return this.flexpartService.selectedSliceType;
  }

  selectionChanged(e: any) { }

  onLayerSelectedEvent(event: { value: string; label: string }) {
    this.selectedLayer = event;
    this.cdr.markForCheck();
  }

  onLayerSelected(){
    this.mapPlotsService.setSelectedLayer(this.selectedLayer.value);
  }

}
