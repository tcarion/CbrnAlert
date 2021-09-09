import { Component, Inject, Input, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
})
export class SelectionDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public items: any) {}

  ngOnInit(
  ): void {
    console.log(this.items)
  }

  // onChange(event: any) {
  //   console.log(event);
  // }
}
