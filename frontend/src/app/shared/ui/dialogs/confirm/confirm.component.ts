import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from '../interfaces';

@Component({
  selector: 'app-confirm',
  template: `
  <div class="flex justify-between">
      <h2 mat-dialog-title>{{data.title || 'Please confirm'}}</h2>

      <button mat-icon-button [mat-dialog-close]="false">
          <mat-icon>close</mat-icon>
      </button>
  </div>
  <div mat-dialog-content>
        {{data.message || 'Are you sure you want to do this?'}}
      </div>
  <div mat-dialog-actions [align]="'end'">
    <button mat-raised-button [mat-dialog-close]="false">No</button>
    <button mat-raised-button color="primary" [mat-dialog-close]="true">Yes</button>
  </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
