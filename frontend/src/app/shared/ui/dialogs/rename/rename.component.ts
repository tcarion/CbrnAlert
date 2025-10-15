import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../interfaces';

@Component({
  selector: 'app-rename',
  templateUrl: './rename.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private dialogRef: MatDialogRef<RenameComponent>
  ) {}

  newName: string = this.data.placeholder || ''; // Pre-fill with current name
  errorMessage: string = ''; // To display validation errors

  validateAndClose(): void {
    const regex = /^[a-zA-Z0-9_-]+$/;

    if (!regex.test(this.newName)) {
      this.errorMessage = 'Invalid characters. Only letters, numbers, "-", and "_" are allowed.';
    } else {
      this.errorMessage = ''; // Clear any previous error
      this.dialogRef.close(this.newName); // Close the dialog and pass the new name
    }
  }

  cancel(): void {
    this.dialogRef.close(null); // Close the dialog with no result
  }
}
