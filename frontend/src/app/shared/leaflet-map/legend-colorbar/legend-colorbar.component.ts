import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { ColorbarData } from './../../../core/api/models/colorbar-data';
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { StringifyOptions } from 'querystring';
import { MapPlot } from 'src/app/core/models/map-plot';


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

  activePlot: MapPlot | null = null;
  activeLayerUnit: string | null = null;

  @Input() set colorbar(value: ColorbarData) {
    if (value.ticks[0] == 0) {
      this.formatedTicks = value.ticks.map(i => (this.formatTick(i) + '%'));
    } else {
      this.formatedTicks = value.ticks.map(i => this.formatTick(i));
    }
    this.colors = value.colors;
  }

  constructor(
    private flexpartService: FlexpartService,
    private mapPlotsService: MapPlotsService,
    private cdr: ChangeDetectorRef 
  ) {

  }

  ngOnInit(): void {
    
    this.mapPlotsService.selectedLayer$.subscribe(layerName => {
      if (layerName) {
        this.layerName = layerName;
        this.updateLegend(layerName);
      }
    });
    
    this.mapPlotsService.activePlot$.subscribe((plot: MapPlot | null) => {
      this.activePlot = plot;
      if (this.activePlot) {
          this.updateLegend(this.activePlot.legendLayer);
      }
      this.cdr.markForCheck();
    });
  }

  formatTick(tick:number) {
    return String(tick)
  }

  setUnit(layerName: string) {
    
    if (layerName == 'ORO') {
      this.unit = 'm';
    } else if (/spec\d+_mr/.test(layerName)) {
      this.unit = 'ng / m³';
    } else if (/D_spec/.test(layerName)) {
      this.unit = 'ng / m²';
    } else if (layerName == 'percentage agreement') {
      this.unit = '% members over threshold';
    } else {
      this.unit = 'No unit';
      console.log("why no units ? " + layerName)
    }
  }
  
  getUnit():string {
    return this.unit
  }

  updateLegend(layerName: string) {
    this.setUnit(layerName)
    this.cdr.markForCheck();
  }

}