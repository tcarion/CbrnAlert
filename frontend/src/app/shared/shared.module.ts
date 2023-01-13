import { ReactiveFormsModule } from '@angular/forms';
import { InfoButtonComponent } from './info-button/info-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormTemplateModule } from './form/form-template.module';

import { SelectionTableModule } from './selection-table/selection-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatListModule } from '@angular/material/list';
import { TopbarModule } from './topbar/topbar.module';
// import { SelectionDialogModule } from 'src/app/flexpart/selection-dialog/selection-dialog.module';
import { SelectionListComponent } from './selection-list/selection-list.component';
import { SelectionListModule } from './selection-list/selection-list.module';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LeafletMapModule } from './leaflet-map/leaflet-map.module';
import { SetDateExtremaDirective } from './set-date-extrema.directive';


@NgModule({
  declarations: [
    SetDateExtremaDirective,
    // InfoButtonComponent
  ],
  imports: [
    CommonModule,
    // AppPipesModule,
    MatProgressSpinnerModule,
    MatListModule,
    FormTemplateModule,
    SelectionTableModule,
    LeafletMapModule,
    // SelectionDialogModule,
  ],
  exports: [
    FormTemplateModule,
    ReactiveFormsModule,
    SelectionTableModule,
    // SelectionDialogModule,
    SelectionListModule,
    TopbarModule,
    LeafletMapComponent,
    SetDateExtremaDirective,
    // InfoButtonComponent,
  ]
})
export class SharedModule { }
