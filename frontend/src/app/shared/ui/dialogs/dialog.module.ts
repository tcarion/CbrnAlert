import { DialogService } from './dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from './confirm/confirm.component';
import { RenameComponent } from './rename/rename.component';


@NgModule({
  // providers: [DialogService],
  declarations: [
    ConfirmComponent,
    RenameComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  exports: [
    ConfirmComponent,
    RenameComponent
  ]
})
export class DialogModule { }
