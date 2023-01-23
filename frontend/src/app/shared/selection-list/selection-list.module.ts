import { MatListModule } from '@angular/material/list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionListComponent } from './selection-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    SelectionListComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [SelectionListComponent]
})
export class SelectionListModule { }
