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




@NgModule({
  declarations: [
    AutoformatSelectComponent,
    DynamicFormComponent,
    MapObjectSelectComponent,
    MapObjectInputComponent,
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
  ],
  exports: [
    AutoformatSelectComponent,
    DynamicFormComponent,
  ],
  providers: [
    FormService,
  ]
})
export class FormTemplateModule {}
