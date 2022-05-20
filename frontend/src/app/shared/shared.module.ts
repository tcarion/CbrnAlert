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
// import { SelectionDialogModule } from 'src/app/flexpart/selection-dialog/selection-dialog.module';
import { SelectionListComponent } from './selection-list/selection-list.component';
import { SelectionListModule } from './selection-list/selection-list.module';


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
    // SelectionDialogModule,
  ],
  exports: [
    FormTemplateModule,
    ReactiveFormsModule,
    SelectionTableModule,
    // SelectionDialogModule,
    SelectionListModule,
    TopbarModule,
    MapComponent,
    // InfoButtonComponent,
  ]
})
export class SharedModule { }
