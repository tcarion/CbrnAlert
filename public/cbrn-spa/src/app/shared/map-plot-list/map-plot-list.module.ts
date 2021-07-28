import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPlotListComponent } from './map-plot-list/map-plot-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapPlotListItemComponent } from './map-plot-list-item/map-plot-list-item.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    MapPlotListItemComponent,
    MapPlotListComponent,
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    MapPlotListComponent
  ]
})
export class MapPlotListModule { }
