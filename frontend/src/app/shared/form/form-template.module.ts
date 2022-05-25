import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

import { FormService } from 'src/app/core/services/form.service';
import { AppPipesModule } from 'src/app/core/pipes/app-pipes.module';
import { AutoformatSelectComponent } from './autoformat-select/autoformat-select.component';
import { MatOptionModule } from '@angular/material/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { MapObjectSelectComponent } from './map-object-select/map-object-select.component';
import { MapObjectInputComponent } from './map-object-input/map-object-input.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { LocationComponent } from './location/location.component';
import { ForecastTimeSelectComponent } from './forecast-time-select/forecast-time-select.component';
import { MatSelectModule } from '@angular/material/select';
import { DynFormComponent } from './dyn-form/dyn-form.component';
import { DynFormQuestionComponent } from './dyn-form-question/dyn-form-question.component';
import { LocationArrayComponent } from './location-array/location-array.component';
import { MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [
    AutoformatSelectComponent,
    DynamicFormComponent,
    MapObjectSelectComponent,
    MapObjectInputComponent,
    LocationComponent,
    ForecastTimeSelectComponent,
    DynFormComponent,
    DynFormQuestionComponent,
    LocationArrayComponent,
  ],
  imports: [
    CommonModule,
    AppPipesModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    TextFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    AutoformatSelectComponent,
    LocationComponent,
    DynamicFormComponent,
    ForecastTimeSelectComponent,
    DynFormQuestionComponent,
    DynFormComponent,
    LocationArrayComponent,
    LocationComponent,
  ],
  providers: [
    FormService,
  ]
})
export class FormTemplateModule {}
