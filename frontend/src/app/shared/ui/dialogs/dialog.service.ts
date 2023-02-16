import { ConfirmDialogData } from './interfaces';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from './confirm/confirm.component';
import { DialogModule } from './dialog.module';

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
}
