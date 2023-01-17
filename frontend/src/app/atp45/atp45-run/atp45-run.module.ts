import { ForecastTimeSelectComponent } from './../../shared/form/forecast-time-select/forecast-time-select.component';
import { FormDirectivesModule } from './../../directives/form-directives/form-directives.module';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Atp45RunComponent } from './atp45-run/atp45-run.component';
import { StabilityFormComponent } from './meteo-form/stability-form/stability-form.component';
import { ReleaseLocationsFormComponent } from './release-locations-form/release-locations-form.component';
import { TabComponent, TabsComponent } from 'src/app/shared/tabs/tabs.component';
import { FieldsetComponent } from 'src/app/shared/form/fieldset/fieldset.component';
import { ArchiveComponent } from './archive/archive.component';

@NgModule({
  declarations: [CaseSelectionComponent, ListItemComponent, SelectionListComponent, MeteoFormComponent, WindFormComponent, Atp45RunComponent, StabilityFormComponent, ReleaseLocationsFormComponent, ArchiveComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    LocationFormModule,
    FormDirectivesModule,
    TabsComponent,
    TabComponent,
    FieldsetComponent,
    SharedModule,
  ],
  providers: [
    Atp45ApiService
],
})
export class Atp45RunModule {}
