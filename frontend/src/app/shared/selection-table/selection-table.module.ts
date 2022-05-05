import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionTableComponent } from './selection-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppPipesModule } from 'src/app/core/pipes/app-pipes.module';

import {MatIconModule} from '@angular/material/icon';
import { ClickStopPropagationDirective } from 'src/app/directives/click-stop-propagation.directive';
import { CommonDirectivesModule } from 'src/app/directives/common-directives.module';
import { InfoButtonComponent } from '../info-button/info-button.component';
import { InfoButtonModule } from '../info-button/info-button.module';
@NgModule({
  declarations: [
    SelectionTableComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AppPipesModule,
    CommonDirectivesModule,
    InfoButtonModule
  ],
  exports: [
    SelectionTableComponent
  ]
})
export class SelectionTableModule {}
