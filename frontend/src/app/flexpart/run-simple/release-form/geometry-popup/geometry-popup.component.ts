import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface GeometryPopupData {
    boxLength: number;
    boxWidth: number;
}
@Component({
    selector: 'app-geometry-popup',
    templateUrl: 'geometry-popup.component.html',
    styleUrls: ['geometry-popup.component.scss'],
  })

export class GeometryPopupComponent {

  form: UntypedFormGroup;

    constructor(


        public dialogRef: MatDialogRef<GeometryPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    // Initialize the form with length and width controls
    this.form = new UntypedFormGroup({
      length: new UntypedFormControl(null, [Validators.required, Validators.min(0)]),
      width: new UntypedFormControl(null, [Validators.required, Validators.min(0)]),
      boxHeight: new UntypedFormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

    onSubmit(): void {
        if (this.form.valid) {
          this.dialogRef.close(this.form.value);
          console.log("Value of box : ", this.form.value)
          console.log("this should be the length : ", this.form.value.length)
        }
      }
  
      onCancel(): void {
        this.dialogRef.close();
        console.log("Value of box : ", this.form.value)
      }
}