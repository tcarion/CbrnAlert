import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPlotListComponent } from './map-plot-list/map-plot-list.component';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    MapPlotListComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule
  ],
  exports: [
    MapPlotListComponent
  ]
})
export class MapPlotListModule { }
