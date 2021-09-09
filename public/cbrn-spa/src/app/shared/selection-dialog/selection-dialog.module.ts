import { MatListModule } from '@angular/material/list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionDialogComponent } from './selection-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    SelectionDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
  ],
  exports: [SelectionDialogComponent]
})
export class SelectionDialogModule { }
