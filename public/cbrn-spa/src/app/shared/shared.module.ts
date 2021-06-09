import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { FormTemplateModule } from './form/form-template.module';

import { DatePipe } from '@angular/common';
import { AppPipesModule } from '../core/pipes/app-pipes.module';
import { SelectionTableModule } from './selection-table/selection-table.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationComponent } from './notification/notification.component';
import { MapComponent } from './map/map.component';
import { MatListModule } from '@angular/material/list';
import { TopbarModule } from './topbar/topbar.module';


@NgModule({
  declarations: [
    MapComponent,
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
    SelectionTableModule,
    TopbarModule,
    MapComponent,
  ]
})
export class SharedModule { }
