import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { ColorbarData } from './../../../core/api/models/colorbar-data';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { StringifyOptions } from 'querystring';


@Component({
  selector: 'app-legend-colorbar',
  templateUrl: './legend-colorbar.component.html',
  styleUrls: ['./legend-colorbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendColorbarComponent implements OnInit {

  formatedTicks: string[];
  colors?: string[];
  layerName: string;
  receivedData:string;
  unit: string;

  activeLayerUnit: string | null = null;

  @Input() set colorbar(value: ColorbarData) {
    this.formatedTicks = value.ticks.map(i => this.formatTick(i));
    this.colors = value.colors;
    //this.unit = value.unit;
    // set unit based on the output variable
      this.setUnit(this.layerName);

    // this.units = value.units;
  }

  // ticksLabels: string[];
  // colors: string[];
  // ticksLabels$: Observable<string[]>;
  // colors$: Observable<string[]>;

  constructor(
    private flexpartService: FlexpartService,
    private mapPlotsService: MapPlotsService,
  ) {

  }

  ngOnInit(): void {
    this.mapPlotsService.selectedLayer$.subscribe(layerName => {
      console.log('Received layerName:', layerName); // Debug log
      if (layerName) {
        this.layerName = layerName;
        this.setUnit(layerName);
        //this.unit = layerName; // for priority when multiple plots
      }
    });

    this.mapPlotsService.activePlot$.subscribe((plot) => {
      if (plot) {
        this.activeLayerUnit = plot.getSelectedLayer()
      }
    })




    // this.ticksLabels$ = of(this.colorbar).pipe(map(cb => cb.ticks!.map((e: number) => { return e.toExponential(2) })))
    // this.ticksLabels = this.colorbar.ticks!.map((e: number) => { return e.toExponential(2) });
    // this.colors = <string[]>this.colorbar.colors
    // this.colors$ = of(this.colorbar).pipe(map(cb => cb.colors as string[]))
  }

  formatTick(tick:number) {
    //return tick.toExponential(2)
    return String(tick)
  }

  setUnit(layerName: string) {
    
    console.log("Checking the layerName! -> " + layerName)
    if (layerName == 'ORO') {
      this.unit = 'm';
    } else if (['spec001_mr'].includes(layerName)) {
      this.unit = 'ng/m³';
    } else if (['WD_spec001', 'DD_spec001', 'TD_spec001'].includes(layerName)) {
      this.unit = 'pg/m²';
    } else {
      this.unit = 'No units';
      console.log("why no units ? " + layerName)
    }
  }
  
  getUnit():string {
    return this.unit
  }


}
