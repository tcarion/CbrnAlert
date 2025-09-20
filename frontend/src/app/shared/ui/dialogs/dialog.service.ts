import { ConfirmDialogData } from './interfaces';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from './confirm/confirm.component';
import { DialogModule } from './dialog.module';
import { RenameComponent } from './rename/rename.component';

@Injectable({
  providedIn: DialogModule
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  confirmDialog(data: ConfirmDialogData) {
    return this.dialog.open(ConfirmComponent, {
      data,
      width: '400px',
      disableClose: false
    }).afterClosed();
  }

  renameDialog(data: ConfirmDialogData) {
    return this.dialog.open(RenameComponent, {
      data,
      width: '400px',
      disableClose: false
    }).afterClosed();
  }
}
