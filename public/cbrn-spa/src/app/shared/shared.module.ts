import { ReactiveFormsModule } from '@angular/forms';
import { InfoButtonComponent } from './info-button/info-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormTemplateModule } from './form/form-template.module';

import { SelectionTableModule } from './selection-table/selection-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MapComponent } from './map/map.component';
import { MatListModule } from '@angular/material/list';
import { TopbarModule } from './topbar/topbar.module';


@NgModule({
  declarations: [
    MapComponent,
    // InfoButtonComponent
  ],
  imports: [
    CommonModule,
    // AppPipesModule,
    MatProgressSpinnerModule,
    MatListModule,
    FormTemplateModule,
    SelectionTableModule,
  ],
  exports: [
    FormTemplateModule,
    ReactiveFormsModule,
    SelectionTableModule,
    TopbarModule,
    MapComponent,
    // InfoButtonComponent,
  ]
})
export class SharedModule { }
