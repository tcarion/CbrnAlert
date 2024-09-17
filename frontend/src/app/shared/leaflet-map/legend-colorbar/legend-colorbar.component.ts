import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { ColorbarData } from './../../../core/api/models/colorbar-data';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
  unit: string;

  @Input() set colorbar(value: ColorbarData) {
    this.formatedTicks = value.ticks.map(i => this.formatTick(i));
    this.colors = value.colors;
    //this.unit = value.unit;
    // set unit based on the output variable
    if (this.layerName == 'spec001_mass') {
      this.unit = 'ng/m³';
    } else if (this.layerName == ' spec001_pptv ') {
      this.unit = 'pptv';
    } else if (this.layerName == 'WD_spec001' || this.layerName == 'DD_spec001') {
      this.unit = 'pg/m²';
    }
    // this.units = value.units;
  }

  // ticksLabels: string[];
  // colors: string[];
  // ticksLabels$: Observable<string[]>;
  // colors$: Observable<string[]>;

  constructor(
    private flexpartService: FlexpartService
  ) {

  }

  ngOnInit(): void {
    // this.ticksLabels$ = of(this.colorbar).pipe(map(cb => cb.ticks!.map((e: number) => { return e.toExponential(2) })))
    // this.ticksLabels = this.colorbar.ticks!.map((e: number) => { return e.toExponential(2) });
    // this.colors = <string[]>this.colorbar.colors
    // this.colors$ = of(this.colorbar).pipe(map(cb => cb.colors as string[]))
  }

  formatTick(tick:number) {
    //return tick.toExponential(2)
    return String(tick)
  }
}
