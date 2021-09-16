import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-selection-dialog',
    templateUrl: './selection-dialog.component.html',
    styleUrls: ['./selection-dialog.component.scss'],
})
export class SelectionDialogComponent implements OnInit {

    items: { dataKey: any[], value: any[] }[]
    title: string

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.items = data.items;
        this.title = data.title;
    }

    ngOnInit(
    ): void {
        console.log(this.items)
    }

    // onChange(event: any) {
    //   console.log(event);
    // }
}
