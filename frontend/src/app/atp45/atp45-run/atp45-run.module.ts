import { LocationFormModule } from 'src/app/shared/form/location-form/location-form.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseSelectionComponent } from './case-selection/case-selection.component';
import { ListItemComponent } from './case-selection/list-item/list-item.component';
import { SelectionListComponent } from './case-selection/selection-list/selection-list.component';
import { Atp45ApiService } from 'src/app/core/api/services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MeteoFormComponent } from './meteo-form/meteo-form.component';
import { WindFormComponent } from './meteo-form/wind-form/wind-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Atp45RunComponent } from './atp45-run/atp45-run.component';

@NgModule({
  declarations: [CaseSelectionComponent, ListItemComponent, SelectionListComponent, MeteoFormComponent, WindFormComponent, Atp45RunComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    LocationFormModule
  ],
  providers: [
    Atp45ApiService
],
})
export class Atp45RunModule {}
