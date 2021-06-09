import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionTableComponent } from './selection-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppPipesModule } from 'src/app/core/pipes/app-pipes.module';

@NgModule({
  declarations: [
    SelectionTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    AppPipesModule,
  ],
  exports: [
    SelectionTableComponent
  ]
})
export class SelectionTableModule {}
